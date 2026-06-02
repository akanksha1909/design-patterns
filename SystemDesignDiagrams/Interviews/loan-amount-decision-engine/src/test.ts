import { evaluate, validateDecisionFlow } from './evaluator';
import { DecisionFlowJSON, DecisionNode, convertJSONToDecisionNode } from './models';
import { CustomerFeatures, EvaluationResult } from './types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Load decision flow from JSON file
 */
function loadDecisionFlow(filePath: string): DecisionNode {
  const jsonContent = fs.readFileSync(filePath, 'utf-8');
  const decisionFlowJSON: DecisionFlowJSON = JSON.parse(jsonContent);
  return convertJSONToDecisionNode(decisionFlowJSON.root);
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Run test cases
 */
function runTests() {
  console.log('='.repeat(80));
  console.log('Loan Amount Decision Engine - Test Suite');
  console.log('='.repeat(80));
  console.log();

  // Load decision flow
  const decisionFlowPath = path.join(__dirname, '..', 'example-decision-flow.json');
  const decisionFlow = loadDecisionFlow(decisionFlowPath);

  // Validate decision flow structure
  console.log('Validating decision flow structure...');
  try {
    validateDecisionFlow(decisionFlow);
    console.log('✓ Decision flow is valid\n');
  } catch (error) {
    console.error('✗ Decision flow validation failed:', error);
    process.exit(1);
  }

  // Test cases from the problem statement
  const testCases: Array<{
    name: string;
    customer: CustomerFeatures;
    expectedOutcome: string;
    expectedAmount: number;
  }> = [
    {
      name: 'Alice',
      customer: {
        CREDIT_SCORE: 780,
        USER_SALARY: 120000,
        EMPLOYMENT_DURATION_DAYS: 900,
      },
      expectedOutcome: 'PREMIUM',
      expectedAmount: 2000000,
    },
    {
      name: 'Bob',
      customer: {
        CREDIT_SCORE: 760,
        USER_SALARY: 45000,
        EMPLOYMENT_DURATION_DAYS: 500,
      },
      expectedOutcome: 'STANDARD',
      expectedAmount: 1000000,
    },
    {
      name: 'Charlie',
      customer: {
        CREDIT_SCORE: 680,
        USER_SALARY: 55000,
        EMPLOYMENT_DURATION_DAYS: 400,
      },
      expectedOutcome: 'BASIC',
      expectedAmount: 300000,
    },
    {
      name: 'Dave',
      customer: {
        CREDIT_SCORE: 680,
        USER_SALARY: 55000,
        EMPLOYMENT_DURATION_DAYS: 200,
      },
      expectedOutcome: 'REJECT',
      expectedAmount: 0,
    },
    {
      name: 'Eve',
      customer: {
        CREDIT_SCORE: 500,
        USER_SALARY: 30000,
        EMPLOYMENT_DURATION_DAYS: 100,
      },
      expectedOutcome: 'REJECT',
      expectedAmount: 0,
    },
  ];

  console.log('Running test cases...\n');
  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Customer Features:`);
    console.log(`    CREDIT_SCORE: ${testCase.customer.CREDIT_SCORE}`);
    console.log(`    USER_SALARY: ${testCase.customer.USER_SALARY}`);
    console.log(`    EMPLOYMENT_DURATION_DAYS: ${testCase.customer.EMPLOYMENT_DURATION_DAYS}`);

    try {
      const result: EvaluationResult = evaluate(decisionFlow, testCase.customer);

      const outcomeMatch = result.outcome.type === testCase.expectedOutcome;
      const amountMatch = result.outcome.approvedAmount === testCase.expectedAmount;

      if (outcomeMatch && amountMatch) {
        console.log(`  ✓ PASSED`);
        console.log(`    Outcome: ${result.outcome.type}`);
        console.log(`    Approved Amount: ${formatCurrency(result.outcome.approvedAmount)}`);
        passed++;
      } else {
        console.log(`  ✗ FAILED`);
        console.log(`    Expected: ${testCase.expectedOutcome} - ${formatCurrency(testCase.expectedAmount)}`);
        console.log(`    Got: ${result.outcome.type} - ${formatCurrency(result.outcome.approvedAmount)}`);
        failed++;
      }

      console.log(`  Evaluation Path:`);
      result.path.forEach((step, i) => {
        console.log(`    ${i + 1}. ${step}`);
      });
      console.log();
    } catch (error) {
      console.log(`  ✗ ERROR: ${error}`);
      failed++;
      console.log();
    }
  });

  console.log('='.repeat(80));
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(80));

  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests
runTests();
