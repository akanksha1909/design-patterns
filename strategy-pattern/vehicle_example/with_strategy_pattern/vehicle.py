class Vehicle:

    def __init__(self, strategy) -> None:
        self.strategy = strategy

    def drive(self):
        self.strategy.drive()