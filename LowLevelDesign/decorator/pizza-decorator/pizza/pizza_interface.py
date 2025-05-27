from abc import ABC, abstractmethod

class PizzaInterface(ABC):

    @abstractmethod
    def get_description(self):
        pass

    @abstractmethod
    def get_cost(self):
        pass