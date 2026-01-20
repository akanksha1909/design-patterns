const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Create a new loan
router.post('/', loanController.createLoan);

// Get all loans (optional query: ?userId=xxx)
router.get('/', loanController.getAllLoans);

// Get loan by ID
router.get('/:id', loanController.getLoanById);

// Get loan statement (complete details)
router.get('/:id/statement', loanController.getLoanStatement);

// Get EMI schedule for a loan
router.get('/:id/emi-schedule', loanController.getEMISchedule);

// Get payment history for a loan
router.get('/:id/payments', loanController.getPaymentHistory);

// Make a payment
router.post('/:id/payments', loanController.makePayment);

module.exports = router;


