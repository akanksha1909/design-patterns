# Example Usage

This document provides example API calls to test the Loan/EMI Repayment System.

## Prerequisites

1. Install dependencies: `npm install`
2. Start the server: `npm start` or `npm run dev`

## Example Flow

### 1. Create a Loan

```bash
curl -X POST http://localhost:3000/api/loans \
  -H "Content-Type: application/json" \
  -d '{
    "principal": 100000,
    "interestRate": 12,
    "tenureMonths": 12,
    "userId": "user123"
  }'
```

**Expected Response:**
- Loan ID will be generated
- EMI amount will be calculated (approximately ₹8,884.87 for ₹1,00,000 at 12% for 12 months)
- Total amount will be calculated (principal + interest)
- EMI schedule will be generated

### 2. Get Loan Details

```bash
curl http://localhost:3000/api/loans/{loan-id}
```

Replace `{loan-id}` with the ID from step 1.

### 3. Get EMI Schedule

```bash
curl http://localhost:3000/api/loans/{loan-id}/emi-schedule
```

This will show all 12 EMIs with:
- Due dates
- Principal and interest components
- Remaining principal after each EMI
- Payment status

### 4. Make First EMI Payment

```bash
curl -X POST http://localhost:3000/api/loans/{loan-id}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 8884.87,
    "paymentMethod": "UPI",
    "remarks": "First EMI payment"
  }'
```

**Expected Result:**
- Payment will be recorded
- First EMI status will change to "PAID"
- Loan's amountPaid will increase
- Remaining balance will decrease

### 5. Make Partial Payment

```bash
curl -X POST http://localhost:3000/api/loans/{loan-id}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "paymentMethod": "CASH",
    "remarks": "Partial payment"
  }'
```

**Expected Result:**
- Second EMI will be marked as "PARTIAL"
- Only ₹5,000 will be allocated to the second EMI

### 6. Complete the Partial Payment

```bash
curl -X POST http://localhost:3000/api/loans/{loan-id}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 3884.87,
    "paymentMethod": "UPI",
    "remarks": "Complete second EMI"
  }'
```

**Expected Result:**
- Second EMI will be marked as "PAID"
- Remaining balance will decrease further

### 7. Get Payment History

```bash
curl http://localhost:3000/api/loans/{loan-id}/payments
```

This will show all payments made for the loan, sorted by date (newest first).

### 8. Get Complete Loan Statement

```bash
curl http://localhost:3000/api/loans/{loan-id}/statement
```

This returns:
- Loan summary
- Complete EMI schedule with current status
- All payment history

### 9. Make Overpayment

```bash
curl -X POST http://localhost:3000/api/loans/{loan-id}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "paymentMethod": "NET_BANKING",
    "remarks": "Overpayment - paying extra"
  }'
```

**Expected Result:**
- Third EMI will be fully paid
- Remaining amount will be allocated to fourth EMI (partial payment)

### 10. Get All Loans for a User

```bash
curl http://localhost:3000/api/loans?userId=user123
```

This returns all loans for the specified user.

## Test Scenarios for Interview

### Scenario 1: Complete Loan Lifecycle
1. Create loan: ₹1,00,000 at 12% for 12 months
2. Make 12 payments of ₹8,884.87 each
3. Verify loan status becomes "CLOSED"
4. Verify remaining balance is 0

### Scenario 2: Partial Payments
1. Create loan
2. Make partial payment (less than EMI amount)
3. Verify EMI status is "PARTIAL"
4. Complete the payment
5. Verify EMI status is "PAID"

### Scenario 3: Overpayment
1. Create loan
2. Make payment greater than EMI amount
3. Verify multiple EMIs are paid
4. Verify remaining balance decreases correctly

### Scenario 4: Multiple Loans
1. Create multiple loans for same user
2. Make payments to different loans
3. Verify each loan tracks payments independently

## Using Postman or Thunder Client

Import these requests:

1. **Create Loan**
   - Method: POST
   - URL: `http://localhost:3000/api/loans`
   - Body (JSON):
     ```json
     {
       "principal": 100000,
       "interestRate": 12,
       "tenureMonths": 12,
       "userId": "user123"
     }
     ```

2. **Get Loan**
   - Method: GET
   - URL: `http://localhost:3000/api/loans/{loan-id}`

3. **Make Payment**
   - Method: POST
   - URL: `http://localhost:3000/api/loans/{loan-id}/payments`
   - Body (JSON):
     ```json
     {
       "amount": 8884.87,
       "paymentMethod": "UPI"
     }
     ```

4. **Get Statement**
   - Method: GET
   - URL: `http://localhost:3000/api/loans/{loan-id}/statement`


