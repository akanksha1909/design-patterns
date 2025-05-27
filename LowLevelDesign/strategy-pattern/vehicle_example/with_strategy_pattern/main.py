from sport_vehicle import SportsVehicle
from off_road_vehicle import OffRoadVehicle
from passenger_vehicle import PassengerVehicle

from strategy.sports_drive_strategy import SportsDriveStrategy
from strategy.normal_drive_strategy import NormalDriveStrategy

sports_vehicle = SportsVehicle(SportsDriveStrategy())
sports_vehicle.drive()

off_road_vehicle = OffRoadVehicle(SportsDriveStrategy())
off_road_vehicle.drive()

passenger_vehicle = PassengerVehicle(NormalDriveStrategy())
passenger_vehicle.drive()


