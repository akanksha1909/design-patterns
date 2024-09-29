from .gui_factory import GUIFactoryInterface
from products.button import LightButton
from products.checkbox import LightCheckBox

class LightThemeFactory(GUIFactoryInterface):
    def create_button(self):
        return LightButton()

    def create_checkbox(self):
        return LightCheckBox()