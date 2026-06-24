export interface ScreenerSubitem {
  id: string;
  label: string;
  hasConditionalText?: boolean;
}

export interface ScreenerQuestion {
  id: number;
  text: string;
  section: "main" | "info";
  type: "yesno" | "yesno_with_text" | "yesno_subitems";
  conditionalTextLabel?: string;
  subitems?: ScreenerSubitem[];
}

export interface ScoringRiskLevel {
  label: string;
  min: number;
  max: number;
}

export interface ScoringRules {
  yesRiskIds: number[];
  noRiskIds: number[];
  nonScoredIds: number[];
  maxScore: number;
  riskLevels: ScoringRiskLevel[];
}

export interface ResourceLink {
  label: string;
  url: string;
}

export interface ScreenerClosingPage {
  title: string;
  thankYouMessage: string;
  nextStepsMessage: string;
  resourceLinks: ResourceLink[];
}

export interface ScreenerRedirects {
  tooYoung: { message: string; ctaLabel?: string; ctaUrl?: string };
  tooOld: { message: string; ctaLabel: string; ctaUrl: string };
}

export interface ScreenerConfig {
  id: string; // "mchat-r" | "cast"
  title: string;
  description: string;
  durationEstimate: string;
  ageRangeMonths: { min: number; max: number };
  redirects: ScreenerRedirects;
  privacyNoticeText: string;
  questions: ScreenerQuestion[];
  scoringRules: ScoringRules;
  closingPage: ScreenerClosingPage;
  footerCopyright?: string;
}

export interface QuestionAnswer {
  questionId: number;
  answer: "yes" | "no" | null;
  conditionalText?: string;
  subitemAnswers?: Record<string, "yes" | "no">;
  subitemConditionalTexts?: Record<string, string>;
}
