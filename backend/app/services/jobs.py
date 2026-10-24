import asyncio
from datetime import datetime, timezone
from typing import AsyncIterator, Optional

from app.schemas import JobEvent, JobEventType, ApiError, ModuleName, PortalId


class JobManager:
    """In-memory event bus and history replay for active investigation SSE streams."""

    def __init__(self):
        self._history: dict[str, list[JobEvent]] = {}
        self._listeners: dict[str, list[asyncio.Queue[JobEvent]]] = {}

    def create(self, report_id: str) -> None:
        if report_id not in self._history:
            self._history[report_id] = []
            self._listeners[report_id] = []

    def emit(
        self,
        report_id: str,
        event_type: JobEventType,
        message: str,
        *,
        module: Optional[ModuleName] = None,
        portal: Optional[PortalId] = None,
        stream_url: Optional[str] = None,
        screenshot_url: Optional[str] = None,
        progress: Optional[float] = None,
        error: Optional[ApiError] = None
    ) -> JobEvent:
        # Guarantee history bucket exists before recording event
        self.create(report_id)

        event = JobEvent(
            report_id=report_id,
            type=event_type,
            ts=datetime.now(timezone.utc),
            message=message,
            module=module,
            portal=portal,
            stream_url=stream_url,
            screenshot_url=screenshot_url,
            progress=progress,
            error=error
        )

        self._history[report_id].append(event)

        if report_id in self._listeners:
            for queue in self._listeners[report_id]:
                queue.put_nowait(event)

        return event

    async def stream(self, report_id: str) -> AsyncIterator[JobEvent]:
        self.create(report_id)
        queue: asyncio.Queue[JobEvent] = asyncio.Queue()
        self._listeners[report_id].append(queue)

        try:
            for past_event in list(self._history.get(report_id, [])):
                yield past_event

            while True:
                event = await queue.get()
                yield event
                if event.type in ("completed", "failed"):
                    break
        finally:
            if report_id in self._listeners and queue in self._listeners[report_id]:
                self._listeners[report_id].remove(queue)


_job_manager: Optional[JobManager] = None


def get_manager() -> JobManager:
    global _job_manager
    if _job_manager is None:
        _job_manager = JobManager()
    return _job_manager
