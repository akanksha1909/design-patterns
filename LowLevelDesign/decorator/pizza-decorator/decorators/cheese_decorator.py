from decorators.pizza_decorator import PizzaDecorator

class CheeseDecorator(PizzaDecorator):

    def get_description(self):
        return self._pizza.get_description() + ", Cheese"
    
    def get_cost(self):
        return self._pizza.get_cost() + 1.25