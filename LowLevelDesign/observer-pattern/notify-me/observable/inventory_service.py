from .inventory_service_interface import InventoryServiceInterface
from product import Product

class InventoryService(InventoryServiceInterface):
    def __init__(self) -> None:
        self.observers = []
        self.product_stock = {}
    
    def register_observer(self, observer):
        self.observers.append(observer)

    def remove_observer(self, observer):
        self.observers.remove(observer)

    def notify_observers(self, product):
        for observer in self.observers:
            observer.update(product)
    
    def update_stock(self, product_id, product_name, stock_count):
        product = Product(product_id, product_name, stock_count)
        self.product_stock[product_id] = stock_count

        if stock_count > 0:
            self.notify_observers(product)
        else:
            print(f"Product '{product.name}' is out of stock.")
