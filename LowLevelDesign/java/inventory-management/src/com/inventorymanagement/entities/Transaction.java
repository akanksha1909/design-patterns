package com.inventorymanagement.entities;

import com.inventorymanagement.enums.TransactionType;

public class Transaction {
    private final Warehouse warehouse;
    private final Product product;
    private final TransactionType transactionType;
    public Transaction(Warehouse warehouse, Product product, TransactionType transactionType) {
        this.transactionType = transactionType;
        this.warehouse = warehouse;
        this.product = product;
    }

    public Warehouse getWarehouse() {
        return this.warehouse;
    }

    public Product getProduct() {
        return this.product;
    }
}
