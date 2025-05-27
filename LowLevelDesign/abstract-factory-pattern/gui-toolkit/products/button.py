from .button_interface import ButtonInterface

class LightButton(ButtonInterface):
    def render(self):
        return "Light button Rendered"
    
class DarkButton(ButtonInterface):
    def render(self):
        return "Dark button Rendered"