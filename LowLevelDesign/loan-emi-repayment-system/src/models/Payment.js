const { v4: uuidv4 } = require('uuid');

class Payment {
  constructor(loanId, amount, paymentMethod = 'CASH') {
    this.id = uuidv4();
    this.loanId = loanId;
    this.amount = amount;
    this.paymentMethod = paymentMethod; // CASH, UPI, CARD, NET_BANKING
    this.paymentDate = new Date();
    this.status = 'SUCCESS'; // SUCCESS, FAILED, PENDING
    this.remarks = '';
  }

  toJSON() {
    return {
      id: this.id,
      loanId: this.loanId,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      paymentDate: this.paymentDate,
      status: this.status,
      remarks: this.remarks
    };
  }
}

module.exports = Payment;


