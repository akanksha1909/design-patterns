import { Coin } from "./Coin";
import { Inventory } from "./product/Inventory";
import { Product } from "./product/Product";
import { IdleState } from "./states/IdleState";
import { VendingMachineState } from "./states/VendingMachineState";

export class VendingMachine {
    private _payment: number = 0;
    public selectedProduct!: Product | null;
    private _state: VendingMachineState;
    private _inventoryManager!: Inventory;
    constructor() {
        this._state = new IdleState(this);
    }

    setInventory(inventory: Inventory) {
        this._inventoryManager = inventory;
    }

    getInventory() {
        return this._inventoryManager;
    }

    addCoin(coin: Coin) {
        this._payment += coin;
    }

    get payment() {
        return this._payment;
    }

    set payment(amount: number) {
        this._payment = amount;
    }

    setState(state: VendingMachineState) {
        this._state = state;
    }

    insertCoin(coin: Coin) {
        this._state.insertCoin(coin);
    }

    selectProduct(product: Product) {
        this._state.selectProduct(product);
    }

    dispense() {
        this._state.dispense();
    }

    returnChange() {
        this._state.returnChange();
    }
}