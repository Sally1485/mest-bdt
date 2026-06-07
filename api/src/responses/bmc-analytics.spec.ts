import { computeBmcAnalytics } from './bmc-analytics';

describe('computeBmcAnalytics', () => {
  it('matches the Cost Structure fixture from the spreadsheet (3.50 / 35%)', () => {
    const data = {
      q1: 'No',
      q1_impact: 9,
      q2: 'No',
      q2_impact: 9,
      q3: 'Yes',
      q3_impact: 8,
      q4: 'Yes',
      q4_impact: 9,
      q5: 'Yes',
      q5_impact: 9,
      q6: 'Yes',
      q6_impact: 9,
      q7: 'Yes',
      q7_impact: 9,
      q8: 'No',
      q8_impact: 7,
      q9: 'Yes',
      q9_impact: 7,
      q10: 'Yes',
      q10_impact: 9,
    };

    expect(computeBmcAnalytics(data)).toEqual({
      score: 3.5,
      percentage: 35,
      total: 10,
      answered: 10,
      questions: 10,
    });
  });

  // Each block was cross-checked against the "BMC Analytics" tab.
  it.each([
    {
      name: 'Revenue Streams',
      impacts: [10, 10, 8, 7, 9, 9, 9],
      answers: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
      score: 8.86,
      percentage: 89,
    },
    {
      name: 'Value Proposition',
      impacts: [10, 10, 10, 8],
      answers: ['Yes', 'Yes', 'Yes', 'Yes'],
      score: 9.5,
      percentage: 95,
    },
    {
      name: 'Key Resources',
      impacts: [10, 10, 10, 10],
      answers: ['No', 'No', 'No', 'Yes'],
      score: -5,
      percentage: -50,
    },
    {
      name: 'Channels',
      impacts: [1, 1, 1, 1, 10],
      answers: ['No', 'No', 'No', 'No', 'No'],
      score: -2.8,
      percentage: -28,
    },
  ])(
    'matches the $name block ($score / $percentage%)',
    ({ impacts, answers, score, percentage }) => {
      const data: Record<string, unknown> = {};
      impacts.forEach((impact, i) => {
        data[`q${i + 1}`] = answers[i];
        data[`q${i + 1}_impact`] = impact;
      });

      const result = computeBmcAnalytics(data);
      expect(result.score).toBe(score);
      expect(result.percentage).toBe(percentage);
    },
  );

  it('excludes unanswered questions from the average', () => {
    const data = {
      q1: 'Yes',
      q1_impact: 8,
      q2: 'No',
      q2_impact: 4,
      // q3 has no answer/impact at all
      q3: null,
      q3_impact: null,
    };

    // Only q1 (+8) and q2 (-4) count → mean = 2 over 2 answered.
    expect(computeBmcAnalytics(data)).toEqual({
      score: 2,
      percentage: 20,
      total: 10,
      answered: 2,
      questions: 3,
    });
  });

  it('treats an answer without an impact as unanswered', () => {
    const data = { q1: 'Yes', q2: 'No', q2_impact: 6 };
    const result = computeBmcAnalytics(data);
    expect(result.answered).toBe(1);
    expect(result.questions).toBe(2);
    expect(result.score).toBe(-6);
    expect(result.percentage).toBe(-60);
  });

  it('returns zeros when nothing is answered (placeholder data)', () => {
    const data = { q1: 'Answer to question 1', q2: 'Answer to question 2' };
    expect(computeBmcAnalytics(data)).toEqual({
      score: 0,
      percentage: 0,
      total: 10,
      answered: 0,
      questions: 2,
    });
  });

  it('returns zeros for an empty object', () => {
    expect(computeBmcAnalytics({})).toEqual({
      score: 0,
      percentage: 0,
      total: 10,
      answered: 0,
      questions: 0,
    });
  });

  it('ignores non-question keys and reason fields', () => {
    const data = {
      q1: 'Yes',
      q1_impact: 10,
      q1_reason: 'because',
      company: 'abc',
      notes: 'irrelevant',
    };
    const result = computeBmcAnalytics(data);
    expect(result.questions).toBe(1);
    expect(result.answered).toBe(1);
    expect(result.score).toBe(10);
  });

  it('tolerates numeric impacts encoded as strings', () => {
    const data = { q1: 'Yes', q1_impact: '8' };
    expect(computeBmcAnalytics(data).score).toBe(8);
  });
});
