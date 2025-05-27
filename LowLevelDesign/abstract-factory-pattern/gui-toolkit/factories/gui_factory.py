from abc import ABC, abstractmethod

class GUIFactoryInterface(ABC):
    @abstractmethod
    def create_button(self):
        pass

    @abstractmethod
    def create_checkbox(self):
        pass