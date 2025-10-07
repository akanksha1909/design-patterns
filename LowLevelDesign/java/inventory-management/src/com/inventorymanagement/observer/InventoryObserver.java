package com.inventorymanagement.observer;

import com.inventorymanagement.entities.Inventory;

public interface InventoryObserver {
    void onStockUpdate(Inventory inventory);
}
