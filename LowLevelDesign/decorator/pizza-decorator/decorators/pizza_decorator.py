from pizza.pizza_interface import PizzaInterface

class PizzaDecorator(PizzaInterface):
    def __init__(self, pizza):
        self._pizza = pizza

    def get_description(self):
        return self._pizza.get_description()
    
    def get_cost(self):
        return self._pizza.get_cost()