import { Coin } from "../Coin";
import { Product } from "../product/Product";
import { ReadyState } from "./ReadyState";
import { VendingMachineState } from "./VendingMachineState";

export class IdleState extends VendingMachineState {
    insertCoin(coin: Coin): void {

    }

    selectProduct(product: Product): void {
        const isAvailable = this.vendingMachine.getInventory().isAvailable(product);
        if (!isAvailable) {
            console.log(`${product.name} is out of stock!`);
            return;
        }
        this.vendingMachine.selectedProduct = product;
        this.vendingMachine.setState(new ReadyState(this.vendingMachine));
    }

    dispense(): void {

    }
}