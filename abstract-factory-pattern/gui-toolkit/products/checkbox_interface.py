from abc import ABC, abstractmethod

class CheckBoxInterface(ABC):
    @abstractmethod
    def render(self):
        pass