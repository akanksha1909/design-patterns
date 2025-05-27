from factories.light_theme_factory import LightThemeFactory
from factories.dark_theme_factory import DarkThemeFactory

def client_code(factory):
    button = factory.create_button()
    checkbox = factory.create_checkbox()

    print(button.render())
    print(checkbox.render())

light_theme_factory = LightThemeFactory()
print("Using Light Theme:")
client_code(light_theme_factory)


dark_theme_factory = DarkThemeFactory()
print("Using Dark Theme:")
client_code(dark_theme_factory)