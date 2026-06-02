# Loan Amount Decision Engine

A TypeScript-based decision engine for evaluating loan applications based on configurable decision flows. The Risk team can define loan approval logic as a structured decision tree, and the engine evaluates customer applications against this tree to determine the approved loan amount.

## Features

- **Configurable Decision Flows**: Define loan approval logic as JSON-based decision trees
- **Type-Safe**: Built with TypeScript for type safety and better developer experience
- **Extensible**: Easy to add new features, operators, and outcomes
- **Guaranteed Single Outcome**: Design ensures every customer lands on exactly one outcome
- **Efficient Evaluation**: Each feature is evaluated at most once per evaluation path

## Project Structure

```
loan-amount-decision-engine/
├── src/
│   ├── types.ts          # Type definitions
│   ├── models.ts         # Domain models and interfaces
│   ├── evaluator.ts      # Core evaluation engine
│   ├── index.ts          # Main entry point and exports
│   └── test.ts           # Test suite with sample customers
├── example-decision-flow.json  # Example decision flow configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Running Tests

```bash
npm test
```

This will run the test suite with the sample customers (Alice, Bob, Charlie, Dave, Eve) and validate the decision flow.

## Usage

### Basic Usage

```typescript
import { evaluate } from './src/evaluator';
import { DecisionNode, DecisionFlowJSON } from './src/models';
import { CustomerFeatures } from './src/types';
import * as fs from 'fs';

// Load decision flow from JSON
const decisionFlowJSON: DecisionFlowJSON = JSON.parse(
  fs.readFileSync('example-decision-flow.json', 'utf-8')
);
const decisionFlow: DecisionNode = decisionFlowJSON.root;

// Customer features
const customerFeatures: CustomerFeatures = {
  CREDIT_SCORE: 780,
  USER_SALARY: 120000,
  EMPLOYMENT_DURATION_DAYS: 900,
};

// Evaluate
const result = evaluate(decisionFlow, customerFeatures);
console.log(`Outcome: ${result.outcome.type}`);
console.log(`Approved Amount: ₹${result.outcome.approvedAmount.toLocaleString('en-IN')}`);
```

### Decision Flow JSON Structure

The decision flow is represented as a binary decision tree where:

- **Condition Nodes**: Have a `condition` and two branches (`trueBranch`, `falseBranch`)
- **Outcome Nodes**: Have an `outcome` with `type` and `approvedAmount`

Example:

```json
{
  "root": {
    "condition": {
      "feature": "CREDIT_SCORE",
      "operator": "greaterThanOrEqual",
      "value": 750
    },
    "trueBranch": {
      "outcome": {
        "type": "PREMIUM",
        "approvedAmount": 2000000
      }
    },
    "falseBranch": {
      "outcome": {
        "type": "REJECT",
        "approvedAmount": 0
      }
    }
  }
}
```

### Supported Operators

- `equal` - Feature equals value
- `notEqual` - Feature does not equal value
- `greaterThan` - Feature is greater than value
- `greaterThanOrEqual` - Feature is greater than or equal to value
- `lessThan` - Feature is less than value
- `lessThanOrEqual` - Feature is less than or equal to value
- `in` - Feature is in array of values
- `notIn` - Feature is not in array of values

### Available Features

- `USER_AGE_IN_YEARS` (int)
- `USER_SALARY` (float)
- `EMPLOYMENT_DURATION_DAYS` (int)
- `CREDIT_SCORE` (int)
- `USER_ACTIVE_LOAN_COUNT` (int)
- `USER_ACTIVE_LOAN_OUTSTANDING` (float)
- `EMPLOYMENT_TYPE` (string)

Additional features can be added by extending the `CustomerFeatures` type.

## Example Decision Flow

The included `example-decision-flow.json` implements the following logic:

```
CREDIT_SCORE >= 750?
├─ YES → USER_SALARY >= 100000?
│         ├─ YES → PREMIUM (₹20,00,000)
│         └─ NO → STANDARD (₹10,00,000)
└─ NO → CREDIT_SCORE >= 650?
         ├─ YES → EMPLOYMENT_DURATION_DAYS >= 365?
         │         ├─ YES → BASIC (₹3,00,000)
         │         └─ NO → REJECT (₹0)
         └─ NO → REJECT (₹0)
```

## Test Results

The test suite validates the engine with the following sample customers:

| Customer | CREDIT_SCORE | USER_SALARY | EMP_DURATION_DAYS | Expected Outcome | Amount |
|----------|--------------|-------------|-------------------|------------------|--------|
| Alice    | 780          | 1,20,000    | 900               | PREMIUM          | ₹20,00,000 |
| Bob      | 760          | 45,000      | 500               | STANDARD         | ₹10,00,000 |
| Charlie  | 680          | 55,000      | 400               | BASIC            | ₹3,00,000 |
| Dave     | 680          | 55,000      | 200               | REJECT           | ₹0 |
| Eve      | 500          | 30,000      | 100               | REJECT           | ₹0 |

## Design Principles

1. **Single Outcome Guarantee**: The tree structure ensures every path leads to exactly one outcome node
2. **Efficient Evaluation**: Each feature is evaluated at most once per customer's evaluation path
3. **Extensibility**: Easy to add new features, operators, and outcome types
4. **Type Safety**: TypeScript ensures compile-time type checking
5. **Validation**: Built-in validation ensures decision flows are well-formed

## Constraints Met

✅ One decision flow configuration is active at a time  
✅ Features are provided as a key-value map at evaluation time  
✅ Each feature is evaluated at most once per evaluation path  
✅ No database or API dependencies - pure in-memory logic  
✅ Clean, extensible design with proper separation of concerns  

