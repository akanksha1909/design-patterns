/**
 * Supported operators for condition evaluation
 */
export type Operator =
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn';

/**
 * Feature names available for evaluation
 */
export type FeatureName =
  | 'USER_AGE_IN_YEARS'
  | 'USER_SALARY'
  | 'EMPLOYMENT_DURATION_DAYS'
  | 'CREDIT_SCORE'
  | 'USER_ACTIVE_LOAN_COUNT'
  | 'USER_ACTIVE_LOAN_OUTSTANDING'
  | 'EMPLOYMENT_TYPE'
  | string; // Allow extensibility for future features

/**
 * Customer feature data provided at evaluation time
 */
export type CustomerFeatures = {
  USER_AGE_IN_YEARS?: number;
  USER_SALARY?: number;
  EMPLOYMENT_DURATION_DAYS?: number;
  CREDIT_SCORE?: number;
  USER_ACTIVE_LOAN_COUNT?: number;
  USER_ACTIVE_LOAN_OUTSTANDING?: number;
  EMPLOYMENT_TYPE?: string;
  [key: string]: number | string | undefined; // Allow extensibility
};

/**
 * Outcome types
 */
export type OutcomeType = 'PREMIUM' | 'STANDARD' | 'BASIC' | 'REJECT' | string;

/**
 * Outcome with approved loan amount
 */
export interface Outcome {
  type: OutcomeType;
  approvedAmount: number;
}

/**
 * Evaluation result
 */
export interface EvaluationResult {
  outcome: Outcome;
  path: string[]; // Track the evaluation path for debugging
}
