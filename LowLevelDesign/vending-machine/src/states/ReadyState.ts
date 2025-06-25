import { Coin } from "../Coin";
import { Product } from "../product/Product";
import { DispenseState } from "./DispenseState";
import { VendingMachineState } from "./VendingMachineState";

export class ReadyState extends VendingMachineState {
    insertCoin(coin: Coin): void {
        this.vendingMachine.addCoin(coin);
        if (this.vendingMachine.payment >= (this.vendingMachine.selectedProduct?.price ?? 0)) {
            this.vendingMachine.setState(new DispenseState(this.vendingMachine));
        }
    }

    selectProduct(product: Product): void {

    }

    dispense(): void {

    }
}