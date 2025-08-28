import { PaymentStrategy } from "./PaymentStrategy";

export class CardPaymentStrategy implements PaymentStrategy {

    makePayment(amount: number): boolean {
        console.log(`Processing payment of $${amount} via card`);
        return true;
        // Here, integrate with a real payment gateway
    }
}