import { PaymentStategy } from "./payment-stratgey";

export class Cash implements PaymentStategy {
    makePayment(amount: number): void {
        console.log(`Paid ${amount} with card.`)
    }
}