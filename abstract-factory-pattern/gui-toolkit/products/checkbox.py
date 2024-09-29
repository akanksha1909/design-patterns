from .checkbox_interface import CheckBoxInterface

class LightCheckBox(CheckBoxInterface):
    def render(self):
        return "Light Checkbox Rendered"
    
class DarkCheckBox(CheckBoxInterface):
    def render(self):
        return "Dark Checkbox Rendered"