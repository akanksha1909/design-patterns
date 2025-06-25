import { Coin } from "./Coin";
import { Inventory } from "./product/Inventory";
import { VendingMachine } from "./VendingMachine";

const inventory = new Inventory();

const coke = inventory.addProduct('Coke', 10, 3);
const chips = inventory.addProduct('Chips', 5, 1);

const vendingMachine = new VendingMachine();
vendingMachine.setInventory(inventory);
vendingMachine.selectProduct(coke);
vendingMachine.insertCoin(Coin.FIVE);
vendingMachine.insertCoin(Coin.TEN);
vendingMachine.dispense();
vendingMachine.returnChange();





