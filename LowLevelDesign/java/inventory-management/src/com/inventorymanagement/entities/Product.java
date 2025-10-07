package com.inventorymanagement.entities;

public class Product {
    private final String id;
    private final String name;
    private final String description;

    private Product(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public static class ProductBuilder {
        private String id;
        private String name;
        private String description;
        public ProductBuilder setProductId(String id) {
            this.id = id;
            return this;
        }

        public ProductBuilder setProductName(String name) {
            this.name = name;
            return this;
        }

        public ProductBuilder setProductDescription(String description) {
            this.description = description;
            return this;
        }

        public Product build() {
            return new Product(id, name, description);
        }

    }
}
