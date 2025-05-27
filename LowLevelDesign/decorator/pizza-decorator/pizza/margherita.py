from pizza.pizza_interface import PizzaInterface

class MargheritaPizza(PizzaInterface):
    def get_description(self):
        return "Margherita Pizza"
    
    def get_cost(self):
        return 5.00  # Base price of a Margherita pizza