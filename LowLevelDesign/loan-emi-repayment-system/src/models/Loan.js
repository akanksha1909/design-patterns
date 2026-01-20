const { v4: uuidv4 } = require('uuid');

class Loan {
  constructor(principal, interestRate, tenureMonths, userId) {
    this.id = uuidv4();
    this.userId = userId;
    this.principal = principal; // Loan amount
    this.interestRate = interestRate; // Annual interest rate (e.g., 12 for 12%)
    this.tenureMonths = tenureMonths; // Loan tenure in months
    this.createdAt = new Date();
    this.status = 'ACTIVE'; // ACTIVE, CLOSED, DEFAULTED
    this.totalAmount = 0; // Total amount to be repaid (principal + interest)
    this.amountPaid = 0; // Total amount paid so far
    this.remainingBalance = 0; // Remaining balance
    this.emiSchedule = []; // Array of EMI objects
    this.payments = []; // Array of payment objects
  }

  // Calculate total amount (principal + interest)
  calculateTotalAmount() {
    const monthlyRate = this.interestRate / 100 / 12;
    const emi = this.calculateEMI();
    this.totalAmount = emi * this.tenureMonths;
    this.remainingBalance = this.totalAmount;
    return this.totalAmount;
  }

  // Calculate EMI using formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
  calculateEMI() {
    const monthlyRate = this.interestRate / 100 / 12;
    if (monthlyRate === 0) {
      return this.principal / this.tenureMonths;
    }
    const emi = (this.principal * monthlyRate * Math.pow(1 + monthlyRate, this.tenureMonths)) /
                (Math.pow(1 + monthlyRate, this.tenureMonths) - 1);
    return Math.round(emi * 100) / 100; // Round to 2 decimal places
  }

  // Generate EMI schedule
  generateEMISchedule() {
    const emi = this.calculateEMI();
    const monthlyRate = this.interestRate / 100 / 12;
    let remainingPrincipal = this.principal;
    this.emiSchedule = [];

    for (let i = 1; i <= this.tenureMonths; i++) {
      const interestComponent = remainingPrincipal * monthlyRate;
      let principalComponent = emi - interestComponent;
      let emiAmount = emi;
      
      // For the last EMI, adjust to ensure remaining principal is exactly 0
      if (i === this.tenureMonths) {
        principalComponent = remainingPrincipal;
        emiAmount = principalComponent + interestComponent;
      }
      
      remainingPrincipal -= principalComponent;

      this.emiSchedule.push({
        emiNumber: i,
        dueDate: this.getDueDate(i),
        emiAmount: Math.round(emiAmount * 100) / 100,
        principalComponent: Math.round(principalComponent * 100) / 100,
        interestComponent: Math.round(interestComponent * 100) / 100,
        remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100),
        status: 'PENDING' // PENDING, PAID, PARTIAL, OVERDUE
      });
    }

    return this.emiSchedule;
  }

  // Get due date for EMI (assuming loan starts from next month)
  getDueDate(emiNumber) {
    const dueDate = new Date(this.createdAt);
    dueDate.setMonth(dueDate.getMonth() + emiNumber);
    return dueDate;
  }

  // Add payment
  addPayment(payment) {
    this.payments.push(payment);
    this.amountPaid += payment.amount;
    this.remainingBalance = Math.max(0, this.totalAmount - this.amountPaid);
    
    // Update EMI schedule based on payments
    this.updateEMISchedule(payment);
    
    // Update loan status
    if (this.remainingBalance <= 0) {
      this.status = 'CLOSED';
    }
  }

  // Update EMI schedule based on payments
  updateEMISchedule(payment) {
    let remainingPayment = payment.amount;
    
    // Process payments in order of EMI numbers
    for (let emi of this.emiSchedule) {
      if (remainingPayment <= 0) break;
      
      if (emi.status === 'PENDING' || emi.status === 'PARTIAL') {
        const amountNeeded = emi.emiAmount - (emi.amountPaid || 0);
        
        if (remainingPayment >= amountNeeded) {
          emi.amountPaid = emi.emiAmount;
          emi.status = 'PAID';
          remainingPayment -= amountNeeded;
        } else {
          emi.amountPaid = (emi.amountPaid || 0) + remainingPayment;
          emi.status = 'PARTIAL';
          remainingPayment = 0;
        }
      }
    }
  }

  // Get loan summary
  getSummary() {
    return {
      id: this.id,
      userId: this.userId,
      principal: this.principal,
      interestRate: this.interestRate,
      tenureMonths: this.tenureMonths,
      emiAmount: this.calculateEMI(),
      totalAmount: this.totalAmount,
      amountPaid: this.amountPaid,
      remainingBalance: this.remainingBalance,
      status: this.status,
      createdAt: this.createdAt,
      paymentsCount: this.payments.length,
      emisPaid: this.emiSchedule.filter(e => e.status === 'PAID').length,
      emisPending: this.emiSchedule.filter(e => e.status === 'PENDING' || e.status === 'PARTIAL').length
    };
  }
}

module.exports = Loan;

