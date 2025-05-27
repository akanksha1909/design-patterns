from pizza.margherita import MargheritaPizza
from decorators.cheese_decorator import CheeseDecorator
from decorators.vegetable_decorator import VegtableDecorator

pizza = MargheritaPizza()
print(f"Base Pizza: {pizza.get_description()}, Cost: ${pizza.get_cost()}")

pizza_with_cheese = CheeseDecorator(pizza)
print(f"With Cheese: {pizza_with_cheese.get_description()}, Cost: ${pizza_with_cheese.get_cost()}")

pizza_with_cheese_and_vegetable = VegtableDecorator(pizza_with_cheese)
print(f"With Cheese and Vegetables: {pizza_with_cheese_and_vegetable.get_description()}, Cost: ${pizza_with_cheese_and_vegetable.get_cost()}")
