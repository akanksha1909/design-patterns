# Loan/EMI Repayment System

A comprehensive Loan and EMI Repayment System built with Node.js and Express. This system was designed for Razorpay machine coding round and covers all core functionalities required for managing loans and EMI repayments.

## Features

### Core Functionalities

1. **Loan Management**
   - Create loans with principal, interest rate, and tenure
   - View loan details and summary
   - List all loans (with optional user filtering)
   - Track loan status (ACTIVE, CLOSED, DEFAULTED)

2. **EMI Calculation**
   - Automatic EMI calculation using standard formula
   - Generate complete EMI schedule
   - Track EMI payment status (PENDING, PAID, PARTIAL, OVERDUE)

3. **Payment Processing**
   - Make payments against loans
   - Support for partial payments
   - Support for overpayments
   - Multiple payment methods (CASH, UPI, CARD, NET_BANKING)
   - Payment history tracking

4. **Loan Statements**
   - Complete loan statement with summary
   - EMI schedule with payment status
   - Payment history

## Project Structure

```
loan-emi-repayment-system/
├── src/
│   ├── index.js                 # Main server file
│   ├── models/
│   │   ├── Loan.js              # Loan model with EMI calculation
│   │   └── Payment.js           # Payment model
│   ├── services/
│   │   └── loanService.js       # Business logic layer
│   ├── controllers/
│   │   └── loanController.js    # Request handlers
│   └── routes/
│       └── loanRoutes.js        # API routes
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Create Loan
**POST** `/api/loans`

Request Body:
```json
{
  "principal": 100000,
  "interestRate": 12,
  "tenureMonths": 12,
  "userId": "user123"
}
```

Response:
```json
{
  "success": true,
  "message": "Loan created successfully",
  "data": {
    "id": "loan-id",
    "userId": "user123",
    "principal": 100000,
    "interestRate": 12,
    "tenureMonths": 12,
    "emiAmount": 8884.87,
    "totalAmount": 106618.44,
    "amountPaid": 0,
    "remainingBalance": 106618.44,
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "paymentsCount": 0,
    "emisPaid": 0,
    "emisPending": 12
  }
}
```

### 2. Get All Loans
**GET** `/api/loans`

Query Parameters (optional):
- `userId`: Filter loans by user ID

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

### 3. Get Loan by ID
**GET** `/api/loans/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "loan-id",
    ...
  }
}
```

### 4. Get Loan Statement
**GET** `/api/loans/:id/statement`

Returns complete loan details including:
- Loan summary
- EMI schedule
- Payment history

### 5. Get EMI Schedule
**GET** `/api/loans/:id/emi-schedule`

Response:
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "emiNumber": 1,
      "dueDate": "2024-02-01T00:00:00.000Z",
      "emiAmount": 8884.87,
      "principalComponent": 7884.87,
      "interestComponent": 1000.00,
      "remainingPrincipal": 92115.13,
      "status": "PENDING"
    },
    ...
  ]
}
```

### 6. Make Payment
**POST** `/api/loans/:id/payments`

Request Body:
```json
{
  "amount": 8884.87,
  "paymentMethod": "UPI",
  "remarks": "Monthly EMI payment"
}
```

Response:
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "payment": {
      "id": "payment-id",
      "loanId": "loan-id",
      "amount": 8884.87,
      "paymentMethod": "UPI",
      "paymentDate": "2024-01-15T00:00:00.000Z",
      "status": "SUCCESS",
      "remarks": "Monthly EMI payment"
    },
    "loan": {
      "id": "loan-id",
      "amountPaid": 8884.87,
      "remainingBalance": 97733.57,
      "status": "ACTIVE",
      "emisPaid": 1,
      ...
    }
  }
}
```

### 7. Get Payment History
**GET** `/api/loans/:id/payments`

Response:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "payment-id",
      "loanId": "loan-id",
      "amount": 8884.87,
      "paymentMethod": "UPI",
      "paymentDate": "2024-01-15T00:00:00.000Z",
      "status": "SUCCESS",
      "remarks": "Monthly EMI payment"
    },
    ...
  ]
}
```

### 8. Health Check
**GET** `/health`

## EMI Calculation Formula

The system uses the standard EMI formula:

```
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
```

Where:
- P = Principal amount
- R = Monthly interest rate (Annual rate / 12 / 100)
- N = Number of monthly installments

## Key Design Decisions

1. **In-Memory Storage**: Currently uses in-memory Map for simplicity. In production, replace with database (MongoDB, PostgreSQL, etc.)

2. **Payment Allocation**: Payments are allocated to EMIs in order (first pending EMI gets paid first)

3. **Partial Payments**: System supports partial payments and tracks them in EMI schedule

4. **Overpayments**: If payment exceeds required EMI amount, it's allocated to next pending EMI

5. **Loan Status**: Automatically updates to CLOSED when remaining balance reaches zero

## Testing the API

### Example Flow:

1. **Create a loan:**
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

2. **Get loan details:**
```bash
curl http://localhost:3000/api/loans/{loan-id}
```

3. **Make a payment:**
```bash
curl -X POST http://localhost:3000/api/loans/{loan-id}/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 8884.87,
    "paymentMethod": "UPI"
  }'
```

4. **Get payment history:**
```bash
curl http://localhost:3000/api/loans/{loan-id}/payments
```

5. **Get complete statement:**
```bash
curl http://localhost:3000/api/loans/{loan-id}/statement
```

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication and authorization
- Interest calculation for overdue payments
- Email/SMS notifications for due dates
- Payment gateway integration
- Loan closure and settlement
- Reports and analytics
- Unit and integration tests

## License

ISC


