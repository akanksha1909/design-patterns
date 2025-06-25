# Vending machine should support multiple products with different prices and quantities
# Machine should accept coins and notes of different denominations
# Machine should dispense the selected product and return change if necessary
# Machine should keep track of available products and their quantities
# Machine should provide interface for restocking products and collecting money
# Machine should handle exceptional scenario such as insufficient stocks or insufficient funds.

"""
class Product {
    name
    quantity
    price
}

class ProductManager {
    allAvailableProducts
    restock(product: Product)
}

class FundManager {
    collectMoney(type, amount)
}

class Funds {
    totalAmount
}

class coins {
    coinDenomination: amount
}

class Notes {
    currency: amount
}

class VendingMachine {
    allAvailableProducts -> [Products]
    placeOrder(Product, amount) -> []
        - check product if available (quantity)
        - collect funds
        - Return change
}
"""