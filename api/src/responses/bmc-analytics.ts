/**
 * Pure computation of BMC (Business Model Canvas) diagnostic analytics for a
 * single Response, mirroring the "BMC Analytics" tab of the source
 * spreadsheet.
 *
 * A BMC diagnostic form is flat, with three keys per question:
 *   - `qN`         : the answer, `"Yes"` or `"No"`
 *   - `qN_impact`  : the impact weight, a number from 1 to 10
 *   - `qN_reason`  : free-text notes (does not affect the score)
 *
 * The spreadsheet derives a hidden "signed impact" per question:
 *   signedImpact = (answer === "Yes" ? +1 : -1) * impact
 *
 * and then, per block (one form = one block):
 *   score      = mean(signedImpact) over ANSWERED questions only
 *   percentage = round(score * 10)        // score is on a -10..10 scale
 *   total      = 10                        // the maximum impact
 *
 * A question is only counted when it has both a valid `Yes`/`No` answer and a
 * finite numeric impact; blank rows are excluded from the average exactly as
 * the spreadsheet excludes empty cells.
 */

export interface BmcAnalytics {
  /** Mean signed impact over answered questions, rounded to 2 decimals. */
  score: number;
  /** `score * 10` rounded to the nearest whole percent (the headline number). */
  percentage: number;
  /** Maximum attainable score — always 10. */
  total: number;
  /** Number of questions that contributed to the score. */
  answered: number;
  /** Number of `qN` questions discovered in the data. */
  questions: number;
}

/** Matches a question-answer key such as `q1`, `q12` (not `q1_impact`). */
const QUESTION_KEY_REGEX = /^q(\d+)$/;

function isYesNo(value: unknown): value is 'Yes' | 'No' {
  return value === 'Yes' || value === 'No';
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  // RJSF normally emits numbers, but tolerate numeric strings just in case.
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Compute BMC analytics from a parsed Response `data` object.
 *
 * The input is the JSON already parsed from `Response.data`. Unknown,
 * non-`qN`, and `qN_reason` keys are ignored. When no question is answered,
 * `score` and `percentage` are `0`.
 */
export function computeBmcAnalytics(
  data: Record<string, unknown>,
): BmcAnalytics {
  let questions = 0;
  let answered = 0;
  let sum = 0;

  for (const key of Object.keys(data)) {
    const match = QUESTION_KEY_REGEX.exec(key);
    if (!match) {
      continue;
    }
    questions += 1;

    const answer = data[key];
    const impact = toFiniteNumber(data[`q${match[1]}_impact`]);
    if (!isYesNo(answer) || impact === null) {
      continue;
    }

    answered += 1;
    sum += (answer === 'Yes' ? 1 : -1) * impact;
  }

  const score = answered > 0 ? sum / answered : 0;

  return {
    score: round2(score),
    percentage: Math.round(score * 10),
    total: 10,
    answered,
    questions,
  };
}
