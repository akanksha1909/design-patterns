from abc import ABC, abstractmethod

class ShapeInterface(ABC):

    @abstractmethod
    def draw(self):
        pass
