from abc import ABC, abstractmethod

class InventoryServiceInterface(ABC):
    @abstractmethod
    def register_observer(self):
        pass

    @abstractmethod
    def remove_observer(self):
        pass

    @abstractmethod
    def notify_observers(self):
        pass