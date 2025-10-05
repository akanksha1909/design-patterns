package com.inventorymanagement;

import com.inventorymanagement.entities.Inventory;
import com.inventorymanagement.entities.Product;
import com.inventorymanagement.entities.Transaction;
import com.inventorymanagement.entities.Warehouse;
import com.inventorymanagement.enums.TransactionType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class InventoryManagerApplication {
    private static InventoryManagerApplication instance;
    private AuditService auditService = AuditService.getInstance();
    private Map<String, Product> products = new HashMap<>();
    private Map<String, Warehouse> warehouses = new HashMap<>();

    private InventoryManagerApplication(){}
    public static InventoryManagerApplication getInstance() {
        if(InventoryManagerApplication.instance == null) {
            InventoryManagerApplication.instance = new InventoryManagerApplication();
        }
        return InventoryManagerApplication.instance;
    }

    public Product createProduct(String name, String description) {
        Product product = new Product.ProductBuilder()
                .setProductId(UUID.randomUUID().toString())
                .setProductName(name)
                .setProductDescription(description)
                .build();
        this.products.put(product.getId(), product);
        return product;
    }

    public Warehouse createWarehouse(String name) {
        Warehouse warehouse = new Warehouse(name);
        this.warehouses.put(warehouse.getId(), warehouse);
        return warehouse;
    }

    public void addProductToInventory(String warehouseId, String productId, Integer quantity) {
        Warehouse warehouse = this.warehouses.get(warehouseId);
        Product product = this.products.get(productId);
        Inventory inventory = new Inventory(product, quantity, warehouse);
        warehouse.addProductToInventory(productId, inventory);

        Transaction transaction = new Transaction(warehouse, product, TransactionType.INITIALSTOCK);
        auditService.addLog(transaction);
    }

    public void getLogs() {
        for(Transaction log: auditService.getLogs()) {
            System.out.println("Product Name " + log.getProduct().getName());
            System.out.println("Warehouse " + log.getWarehouse().getName());
        }
    }

}
