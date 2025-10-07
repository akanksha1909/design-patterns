package com.inventorymanagement.observer;

import com.inventorymanagement.entities.Inventory;

public class LowStockAlertObserver implements  InventoryObserver{

    public void onStockUpdate(Inventory inventory) {
        if(inventory.getQuantity() < inventory.getThreshold()) {
            System.out.printf("Alert: Low stock for %s in warehouse %s. Current quantity: %d",
                    inventory.getProduct().getName(),
                    inventory.getWarehouse().getName(),
                    inventory.getQuantity());
        }
    }
}
