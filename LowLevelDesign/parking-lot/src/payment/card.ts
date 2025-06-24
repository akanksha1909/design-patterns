import { PaymentStategy } from "./payment-stratgey";

export class Card implements PaymentStategy {
    makePayment(amount: number): void {
        console.log(`Paid ${amount} with card.`)
    }
}