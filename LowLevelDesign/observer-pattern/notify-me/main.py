from observable.inventory_service import InventoryService
from observer.user import User

inventory_service = InventoryService()
user_one = User("Ak", "email")
user_two = User("An", "sms")

inventory_service.register_observer(user_one)
inventory_service.register_observer(user_two)

product_id = 101
inventory_service.update_stock(product_id, "Laptop", 0) # Out of stock
inventory_service.update_stock(product_id, "Laptop", 10) # Back in stock

