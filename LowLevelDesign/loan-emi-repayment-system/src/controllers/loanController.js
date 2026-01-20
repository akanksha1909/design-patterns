const loanService = require('../services/loanService');

class LoanController {
  // Create a new loan
  createLoan = (req, res, next) => {
    try {
      const { principal, interestRate, tenureMonths, userId } = req.body;

      if (!principal || !interestRate || !tenureMonths || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: principal, interestRate, tenureMonths, userId'
        });
      }

      const loan = loanService.createLoan(
        parseFloat(principal),
        parseFloat(interestRate),
        parseInt(tenureMonths),
        userId
      );

      res.status(201).json({
        success: true,
        message: 'Loan created successfully',
        data: loan.getSummary()
      });
    } catch (error) {
      next(error);
    }
  };

  // Get loan by ID
  getLoanById = (req, res, next) => {
    try {
      const { id } = req.params;
      const loan = loanService.getLoanById(id);

      res.json({
        success: true,
        data: loan.getSummary()
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all loans
  getAllLoans = (req, res, next) => {
    try {
      const { userId } = req.query;
      const loans = loanService.getAllLoans(userId);

      res.json({
        success: true,
        count: loans.length,
        data: loans.map(loan => loan.getSummary())
      });
    } catch (error) {
      next(error);
    }
  };

  // Make a payment
  makePayment = (req, res, next) => {
    try {
      const { id } = req.params;
      const { amount, paymentMethod, remarks } = req.body;

      if (!amount) {
        return res.status(400).json({
          success: false,
          message: 'Payment amount is required'
        });
      }

      const result = loanService.makePayment(
        id,
        parseFloat(amount),
        paymentMethod || 'CASH',
        remarks || ''
      );

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Get payment history
  getPaymentHistory = (req, res, next) => {
    try {
      const { id } = req.params;
      const payments = loanService.getPaymentHistory(id);

      res.json({
        success: true,
        count: payments.length,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  };

  // Get EMI schedule
  getEMISchedule = (req, res, next) => {
    try {
      const { id } = req.params;
      const emiSchedule = loanService.getEMISchedule(id);

      res.json({
        success: true,
        count: emiSchedule.length,
        data: emiSchedule
      });
    } catch (error) {
      next(error);
    }
  };

  // Get loan statement
  getLoanStatement = (req, res, next) => {
    try {
      const { id } = req.params;
      const statement = loanService.getLoanStatement(id);

      res.json({
        success: true,
        data: statement
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new LoanController();


