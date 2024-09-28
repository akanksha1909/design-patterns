from vehicle import Vehicle

class SportsVehicle(Vehicle):
    def __init__(self, drive_strategy) -> None:
        super().__init__(drive_strategy)