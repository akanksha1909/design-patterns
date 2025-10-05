package com.inventorymanagement;

import com.inventorymanagement.entities.Product;
import com.inventorymanagement.entities.Warehouse;

public class Demo {
    public static void main(String args[]) {
        InventoryManagerApplication service = InventoryManagerApplication.getInstance();
        Warehouse w1 = service.createWarehouse("W1");
        Product samsungPhone = service.createProduct("Samsung Galaxy", "Premium phone");
        Product iPhone = service.createProduct("iPhone 11", "Premium phone");

        service.addProductToInventory(w1.getId(), samsungPhone.getId(), 10);
        service.addProductToInventory(w1.getId(), iPhone.getId(), 5);

        service.addStock(w1.getId(), samsungPhone.getId(), 20);
        service.removeStock(w1.getId(), samsungPhone.getId(), 5);

        service.getLogs();
    }
}
