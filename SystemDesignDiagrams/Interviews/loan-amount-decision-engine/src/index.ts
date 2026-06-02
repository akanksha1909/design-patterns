import { evaluate, validateDecisionFlow } from './evaluator';
import { DecisionFlowJSON, DecisionNode } from './models';
import { CustomerFeatures, EvaluationResult } from './types';

/**
 * Main entry point for the Loan Amount Decision Engine
 * This demonstrates how to use the engine programmatically
 */
export function evaluateLoanApplication(
  decisionFlow: DecisionNode,
  customerFeatures: CustomerFeatures
): EvaluationResult {
  // Validate decision flow structure
  validateDecisionFlow(decisionFlow);

  // Evaluate and return result
  return evaluate(decisionFlow, customerFeatures);
}

// Export all public APIs
export { evaluate, validateDecisionFlow } from './evaluator';
export * from './types';
export * from './models';
