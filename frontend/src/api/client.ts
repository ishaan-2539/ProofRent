import type {
  ApiError,
  ErrorResponse,
  InvestigateRequest,
  InvestigateResponse,
  Report,
  ExampleListing,
  PreflightResult,
  DecisionRequest,
} from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiClientError extends Error {
  error: ApiError;
  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.error = error;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    let apiError: ApiError;
    try {
      const errJson = (await res.json()) as ErrorResponse;
      apiError = errJson.error;
    } catch {
      apiError = {
        code: "INTERNAL",
        message: "An unexpected network error occurred.",
        next_step: "Please try again.",
      };
    }
    throw new ApiClientError(apiError);
  }

  return res.json() as Promise<T>;
}

export async function startInvestigation(req: InvestigateRequest): Promise<InvestigateResponse> {
  return request<InvestigateResponse>("/api/investigations", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getReport(reportId: string): Promise<Report> {
  return request<Report>(`/api/reports/${reportId}`);
}

export async function getExamples(): Promise<ExampleListing[]> {
  return request<ExampleListing[]>("/api/examples");
}

export async function getPreflight(): Promise<PreflightResult> {
  return request<PreflightResult>("/api/preflight");
}

export async function submitMatchDecision(reportId: string, req: DecisionRequest): Promise<Report> {
  return request<Report>(`/api/reports/${reportId}/decision`, {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export function getPdfUrl(reportId: string): string {
  return `${BASE_URL}/api/reports/${reportId}/pdf`;
}

export async function submitDecision(
  reportId: string,
  body: {
    verdict?: string;
    notes?: string;
    candidate_id?: string;
    decision?: "confirm" | "reject" | "flag" | string;
  }
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/reports/${reportId}/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to submit decision (${res.status})`);
  }
}

export async function exportPdf(reportId: string): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/api/investigations/${reportId}/export/pdf`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to export PDF report (${res.status})`);
  }

  return await res.blob();
}