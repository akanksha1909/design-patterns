import { PaymentStrategy } from "./PaymentStrategy";

export class WalletPaymentStrategy implements PaymentStrategy {

    makePayment(amount: number): boolean {
        console.log(`Processing payment of $${amount} via wallet`);
        // Here, integrate with a real payment gateway
        return true;
    }
}