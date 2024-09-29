from .observer_interface import ObserverInterface

class User(ObserverInterface):
    def __init__(self, user_name, notification_type) -> None:
        self.user_name = user_name
        self.notification_type = notification_type

    def update(self, product):
        print(f"{self.user_name}, the product '{product.name}' is now back in stock! Notification sent via {self.notification_type}.")
