import {
  CustomerFeatures,
  EvaluationResult,
  Operator,
} from './types';
import { DecisionNode, Condition } from './models';

/**
 * Evaluates a condition against customer features
 */
function evaluateCondition(
  condition: Condition,
  features: CustomerFeatures
): boolean {
  const featureValue = features[condition.feature];

  // Handle missing feature values
  if (featureValue === undefined || featureValue === null) {
    return false; // Default to false for missing features
  }

  const { operator, value } = condition;

  switch (operator) {
    case 'equal':
      return featureValue === value;

    case 'notEqual':
      return featureValue !== value;

    case 'greaterThan':
      return Number(featureValue) > Number(value);

    case 'greaterThanOrEqual':
      return Number(featureValue) >= Number(value);

    case 'lessThan':
      return Number(featureValue) < Number(value);

    case 'lessThanOrEqual':
      return Number(featureValue) <= Number(value);

    case 'in':
      if (!Array.isArray(value)) {
        throw new Error("Operator 'in' requires an array value");
      }
      return value.includes(featureValue as string | number);

    case 'notIn':
      if (!Array.isArray(value)) {
        throw new Error("Operator 'notIn' requires an array value");
      }
      return !value.includes(featureValue as string | number);

    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

/**
 * Recursively evaluates a decision node and returns the outcome
 * Ensures exactly one outcome is returned by traversing the tree
 */
function evaluateNode(
  node: DecisionNode,
  features: CustomerFeatures,
  path: string[] = []
): EvaluationResult {
  // If this is an outcome node (leaf), return it
  if (node.outcome) {
    return {
      outcome: node.outcome,
      path: [...path, `OUTCOME:${node.outcome.type}`],
    };
  }

  // If this is a condition node, evaluate the condition
  if (node.condition) {
    const conditionResult = evaluateCondition(node.condition, features);
    const conditionDescription = `${node.condition.feature} ${node.condition.operator} ${JSON.stringify(node.condition.value)}`;
    const newPath = [...path, `${conditionDescription} -> ${conditionResult}`];

    // Follow the appropriate branch
    if (conditionResult) {
      if (!node.trueBranch) {
        throw new Error(
          `Condition evaluated to true but no trueBranch defined: ${conditionDescription}`
        );
      }
      return evaluateNode(node.trueBranch, features, newPath);
    } else {
      if (!node.falseBranch) {
        throw new Error(
          `Condition evaluated to false but no falseBranch defined: ${conditionDescription}`
        );
      }
      return evaluateNode(node.falseBranch, features, newPath);
    }
  }

  // If neither condition nor outcome is present, this is an invalid node
  throw new Error('Decision node must have either a condition or an outcome');
}

/**
 * Main evaluation function
 * Evaluates a decision flow against customer features and returns the outcome
 */
export function evaluate(
  decisionFlow: DecisionNode,
  customerFeatures: CustomerFeatures
): EvaluationResult {
  if (!decisionFlow) {
    throw new Error('Decision flow is required');
  }

  if (!customerFeatures || Object.keys(customerFeatures).length === 0) {
    throw new Error('Customer features are required');
  }

  return evaluateNode(decisionFlow, customerFeatures);
}

/**
 * Validates that a decision flow is well-formed
 * Ensures every path leads to exactly one outcome
 */
export function validateDecisionFlow(node: DecisionNode, path: string[] = []): void {
  // If it's an outcome node, it's valid (leaf node)
  if (node.outcome) {
    return;
  }

  // If it's a condition node, both branches must be defined and valid
  if (node.condition) {
    if (!node.trueBranch) {
      throw new Error(
        `Condition node missing trueBranch at path: ${path.join(' -> ')}`
      );
    }
    if (!node.falseBranch) {
      throw new Error(
        `Condition node missing falseBranch at path: ${path.join(' -> ')}`
      );
    }

    const conditionDesc = `${node.condition.feature} ${node.condition.operator}`;
    validateDecisionFlow(node.trueBranch, [...path, `${conditionDesc} (true)`]);
    validateDecisionFlow(node.falseBranch, [...path, `${conditionDesc} (false)`]);
  } else {
    throw new Error(
      `Invalid node: must have either condition or outcome at path: ${path.join(' -> ')}`
    );
  }
}
