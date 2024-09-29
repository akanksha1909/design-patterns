from shape_factory import ShapeFactory

shape_factory = ShapeFactory()
shape_obj = shape_factory.get_shape("CIRCLE")
shape_obj.draw()