from abc import ABC, abstractmethod

class ObserverInterface(ABC):

    @abstractmethod
    def update(self, product):
        pass