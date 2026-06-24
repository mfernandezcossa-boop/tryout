import type { QuestionAnswer, ScoringRules } from "./screenerTypes";

export function calculateScore(answers: QuestionAnswer[], rules: ScoringRules): number {
  let score = 0;
  for (const a of answers) {
    if (rules.nonScoredIds.includes(a.questionId)) continue;
    if (rules.yesRiskIds.includes(a.questionId) && a.answer === "yes") score += 1;
    if (rules.noRiskIds.includes(a.questionId) && a.answer === "no") score += 1;
  }
  return score;
}

export function getRiskLevel(score: number, rules: ScoringRules): string {
  const match = rules.riskLevels.find((l) => score >= l.min && score <= l.max);
  return match?.label ?? "indeterminado";
}
