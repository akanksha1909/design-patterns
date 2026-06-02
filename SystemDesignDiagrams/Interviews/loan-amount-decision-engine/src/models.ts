import { Operator, FeatureName, OutcomeType, Outcome } from './types';

/**
 * Condition represents a single condition to evaluate
 */
export interface Condition {
  feature: FeatureName;
  operator: Operator;
  value: number | string | (number | string)[]; // For 'in' and 'notIn' operators
}

/**
 * Decision node in the decision tree
 * Can be either a condition node (with branches) or an outcome node (leaf)
 */
export interface DecisionNode {
  id?: string; // Optional identifier for debugging
  condition?: Condition; // If present, this is a condition node
  outcome?: Outcome; // If present, this is a leaf/outcome node
  trueBranch?: DecisionNode; // Next node if condition evaluates to true
  falseBranch?: DecisionNode; // Next node if condition evaluates to false
}

/**
 * Decision flow configuration
 * Represents the entire decision tree
 */
export interface DecisionFlow {
  root: DecisionNode;
  metadata?: {
    version?: string;
    description?: string;
    createdAt?: string;
  };
}

/**
 * JSON structure for serialization/deserialization
 * This is the format the Risk team will use to configure decision flows
 */
export interface DecisionFlowJSON {
  root: DecisionNodeJSON;
  metadata?: {
    version?: string;
    description?: string;
    createdAt?: string;
  };
}

export interface DecisionNodeJSON {
  id?: string;
  condition?: {
    feature: string;
    operator: string;
    value: number | string | (number | string)[];
  };
  outcome?: {
    type: string;
    approvedAmount: number;
  };
  trueBranch?: DecisionNodeJSON;
  falseBranch?: DecisionNodeJSON;
}

/**
 * Converts a DecisionNodeJSON to DecisionNode with proper type validation
 */
export function convertJSONToDecisionNode(jsonNode: DecisionNodeJSON): DecisionNode {
  const node: DecisionNode = {
    id: jsonNode.id,
  };

  if (jsonNode.condition) {
    // Validate operator
    const validOperators: Operator[] = [
      'equal',
      'notEqual',
      'greaterThan',
      'greaterThanOrEqual',
      'lessThan',
      'lessThanOrEqual',
      'in',
      'notIn',
    ];
    
    if (!validOperators.includes(jsonNode.condition.operator as Operator)) {
      throw new Error(
        `Invalid operator: ${jsonNode.condition.operator}. Valid operators are: ${validOperators.join(', ')}`
      );
    }

    node.condition = {
      feature: jsonNode.condition.feature as FeatureName,
      operator: jsonNode.condition.operator as Operator,
      value: jsonNode.condition.value,
    };

    if (jsonNode.trueBranch) {
      node.trueBranch = convertJSONToDecisionNode(jsonNode.trueBranch);
    }
    if (jsonNode.falseBranch) {
      node.falseBranch = convertJSONToDecisionNode(jsonNode.falseBranch);
    }
  }

  if (jsonNode.outcome) {
    node.outcome = {
      type: jsonNode.outcome.type as OutcomeType,
      approvedAmount: jsonNode.outcome.approvedAmount,
    };
  }

  return node;
}

/**
 * Converts a DecisionFlowJSON to DecisionFlow
 */
export function convertJSONToDecisionFlow(jsonFlow: DecisionFlowJSON): DecisionFlow {
  return {
    root: convertJSONToDecisionNode(jsonFlow.root),
    metadata: jsonFlow.metadata,
  };
}
