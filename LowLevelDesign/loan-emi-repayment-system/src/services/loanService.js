const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

// In-memory storage (in production, use database)
const loans = new Map();
const payments = new Map();

class LoanService {
  // Create a new loan
  createLoan(principal, interestRate, tenureMonths, userId) {
    // Validation
    if (!principal || principal <= 0) {
      throw new Error('Principal amount must be greater than 0');
    }
    if (!interestRate || interestRate < 0) {
      throw new Error('Interest rate must be non-negative');
    }
    if (!tenureMonths || tenureMonths <= 0 || !Number.isInteger(tenureMonths)) {
      throw new Error('Tenure must be a positive integer (in months)');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }

    const loan = new Loan(principal, interestRate, tenureMonths, userId);
    loan.calculateTotalAmount();
    loan.generateEMISchedule();
    
    loans.set(loan.id, loan);
    return loan;
  }

  // Get loan by ID
  getLoanById(loanId) {
    const loan = loans.get(loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }
    return loan;
  }

  // Get all loans (optionally filter by userId)
  getAllLoans(userId = null) {
    const allLoans = Array.from(loans.values());
    if (userId) {
      return allLoans.filter(loan => loan.userId === userId);
    }
    return allLoans;
  }

  // Make a payment
  makePayment(loanId, amount, paymentMethod = 'CASH', remarks = '') {
    // Validation
    if (!amount || amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }

    const loan = this.getLoanById(loanId);
    
    if (loan.status === 'CLOSED') {
      throw new Error('Loan is already closed');
    }

    // Create payment record
    const payment = new Payment(loanId, amount, paymentMethod);
    payment.remarks = remarks;
    
    // Add payment to loan
    loan.addPayment(payment);
    
    // Store payment
    payments.set(payment.id, payment);
    
    // Update loan in storage
    loans.set(loanId, loan);
    
    return {
      payment: payment.toJSON(),
      loan: loan.getSummary()
    };
  }

  // Get payment history for a loan
  getPaymentHistory(loanId) {
    this.getLoanById(loanId); // Validate loan exists
    
    const loanPayments = Array.from(payments.values())
      .filter(payment => payment.loanId === loanId)
      .sort((a, b) => b.paymentDate - a.paymentDate)
      .map(payment => payment.toJSON());
    
    return loanPayments;
  }

  // Get EMI schedule for a loan
  getEMISchedule(loanId) {
    const loan = this.getLoanById(loanId);
    return loan.emiSchedule;
  }

  // Get loan statement (summary + payment history + EMI schedule)
  getLoanStatement(loanId) {
    const loan = this.getLoanById(loanId);
    const paymentHistory = this.getPaymentHistory(loanId);
    
    return {
      loan: loan.getSummary(),
      emiSchedule: loan.emiSchedule,
      paymentHistory: paymentHistory
    };
  }
}

module.exports = new LoanService();


