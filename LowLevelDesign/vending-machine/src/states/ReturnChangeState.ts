import { Coin } from "../Coin";
import { Product } from "../product/Product";
import { IdleState } from "./IdleState";
import { ReadyState } from "./ReadyState";
import { VendingMachineState } from "./VendingMachineState";

export class ReturnChangeState extends VendingMachineState {
    insertCoin(coin: Coin): void {
        console.log("Cannot insert coin while returning change. Please collect your change first.");
    }

    selectProduct(product: Product): void {
        console.log("Cannot select product while returning change. Please collect your change first.");
    }

    returnChange(): number {
        const change = this.vendingMachine.payment - (this.vendingMachine.selectedProduct?.price ?? 0);
        if (change > 0) {
            console.log(`Collect your change: ${change} rupees!`);
        }

        this.vendingMachine.payment = 0;
        this.vendingMachine.selectedProduct = null;
        this.vendingMachine.setState(new IdleState(this.vendingMachine));
        return change;
    }

    dispense(): void {
        console.log("Product already dispensed. Please collect your change.");
    }
}