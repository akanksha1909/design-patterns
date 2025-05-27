from decorators.pizza_decorator import PizzaDecorator

class VegtableDecorator(PizzaDecorator):

    def get_description(self):
        return self._pizza.get_description() + ", Vegetable"
    
    def get_cost(self):
        return self._pizza.get_cost() + 0.75