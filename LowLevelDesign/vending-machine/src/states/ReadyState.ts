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
        console.log(`Product is already Selected! ${product.name}`)
    }

    dispense(): void {
        const selectedProduct = this.vendingMachine.selectedProduct;
        if (!selectedProduct) {
            console.log("Please select a product first");
            return;
        }
        const remainingAmount = selectedProduct.price - this.vendingMachine.payment;
        if (remainingAmount > 0) {
            console.log(`Please insert $${remainingAmount} more`);
        }

    }
}