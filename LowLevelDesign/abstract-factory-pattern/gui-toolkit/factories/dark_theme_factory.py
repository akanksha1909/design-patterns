from .gui_factory import GUIFactoryInterface
from products.button import DarkButton
from products.checkbox import DarkCheckBox

class DarkThemeFactory(GUIFactoryInterface):
    def create_button(self):
        return DarkButton()

    def create_checkbox(self):
        return DarkCheckBox()