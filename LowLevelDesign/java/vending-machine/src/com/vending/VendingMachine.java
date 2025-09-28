package com.vending;

import com.vending.entities.Product;
import com.vending.enums.Coin;
import com.vending.state.IdleMachineState;
import com.vending.state.VendingMachineState;

public class VendingMachine {
    private static VendingMachine instance;
    private final InventoryService inventoryService;
    private VendingMachineState state;
    private String selectedProduct = null;
    private Integer payment = 0;
    private VendingMachine(){
        this.inventoryService = InventoryService.getInstance();
        this.state = new IdleMachineState(this);
    }

    public static VendingMachine getInstance(){
        if(VendingMachine.instance == null) {
            VendingMachine.instance = new VendingMachine();
        }
        return VendingMachine.instance;
    }

    public InventoryService getInventory(){
        return this.inventoryService;
    }

    public void setSelectedProduct(String productId){
        this.selectedProduct = productId;
    }

    public Product getSelectedProduct(){
        return this.inventoryService.getProduct(this.selectedProduct);
    }

    public String addProduct(String name, Integer price, Integer quantity) {
        Product product = new Product(name, price);
        this.inventoryService.addToInventory(product, quantity);
        return product.getId();
    }

    public void selectProduct(String productId) {
        this.state.selectProduct(productId);
    }

    public void setState(VendingMachineState state){
        this.state = state;
    }

    public void addCoin(Coin coin) {
        this.payment += coin.getValue();
    }

    public void insertCoin(Coin coin) {
        this.state.insertCoin(coin);
    }

    public Integer getPayment() {
        return this.payment;
    }

    public void dispense(){
        this.state.dispense();
    }

    public void setPayment(Integer amount){
        this.payment = amount;
    }

    public void refund() {
        this.state.refund();
    }
}
