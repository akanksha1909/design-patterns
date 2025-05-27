from circle import Circle
from rectangle import Rectangle

class ShapeFactory:
    
    def get_shape(self, input):
        if input == "CIRCLE":
            return Circle()
        elif input == "RECTANGLE":
            return Rectangle()
        else:
            return None
