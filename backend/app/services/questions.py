import logging
from typing import List, Optional

from app.core.constants import get_constants
from app.schemas import CostLadder, Finding, ListingFields, QuestionItem

logger = logging.getLogger(__name__)


def build_questions(
    listing: ListingFields,
    findings: List[Finding],
    cost: Optional[CostLadder] = None,
) -> List[QuestionItem]:
    questions: List[QuestionItem] = []
    q_counter = 1

    # 1. Questions derived from findings
    for finding in findings:
        if finding.question:
            questions.append(
                QuestionItem(
                    question_id=f"q_{q_counter}",
                    text=finding.question,
                    finding_id=finding.finding_id,
                    is_default=False,
                )
            )
            q_counter += 1

    # 2. Questions derived from unknown cost ladder lines
    if cost and cost.lines:
        for line in cost.lines:
            if line.label == "unknown" and line.question:
                # Avoid duplicate question texts
                if not any(q.text == line.question for q in questions):
                    questions.append(
                        QuestionItem(
                            question_id=f"q_{q_counter}",
                            text=line.question,
                            finding_id="find_cost_structure",
                            is_default=False,
                        )
                    )
                    q_counter += 1

    # 3. Fallback default questions if fewer than 3 questions generated
    default_questions = get_constants().get(
        "default_questions",
        [
            "How many days after I leave is the deposit refunded?",
            "What is the notice period, and is any rent forfeited?",
            "How is electricity billed (metered, per-unit rate, or fixed)?",
        ],
    )

    for default_q in default_questions:
        if len(questions) >= 3:
            break
        if not any(q.text == default_q for q in questions):
            questions.append(
                QuestionItem(
                    question_id=f"q_{q_counter}",
                    text=default_q,
                    finding_id=None,
                    is_default=True,
                )
            )
            q_counter += 1

    return questions