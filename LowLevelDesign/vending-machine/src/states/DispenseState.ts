import { Coin } from "../Coin";
import { Product } from "../product/Product";
import { ReturnChangeState } from "./ReturnChangeState";
import { VendingMachineState } from "./VendingMachineState";

export class DispenseState extends VendingMachineState {
    insertCoin(coin: Coin): void {
        console.log("Cannot insert coins while dispensing. Please wait.");
    }

    selectProduct(product: Product): void {
        console.log("Cannot select product while dispensing. Please wait.");
    }

    dispense(): void {
        const product = this.vendingMachine.selectedProduct;
        if (product) {
            this.vendingMachine.getInventory().dispenseProduct(product);
            console.log(`Collect your ${product.name}`);
            this.vendingMachine.setState(new ReturnChangeState(this.vendingMachine));
        }
    }
}