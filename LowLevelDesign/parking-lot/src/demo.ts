import { ParkingFloor } from "./parking-floor";
import { ParkingSpot } from "./parking-spot";
import { VehicleFactory } from "./vehicle/vechicle-factory";
import { Vehicle } from "./vehicle/vehicle";
import { VehicleType } from "./vehicle/vehicle-type";

const car1 = VehicleFactory.createVehicle("Car", "CAR123");
const car2 = VehicleFactory.createVehicle("Car", "CAR345");

const bike1 = VehicleFactory.createVehicle("Bike", "BIKE123");
const bike2 = VehicleFactory.createVehicle("Bike", "BIKE345");

const parkingSpotFloor11 = new ParkingSpot(1, VehicleType.BIKE);
const parkingSpotFloor12 = new ParkingSpot(2, VehicleType.CAR);

const parkingSpotFloor21 = new ParkingSpot(1, VehicleType.CAR);

const parkingFloorOne = new ParkingFloor(1, [parkingSpotFloor11, parkingSpotFloor12]);
const parkingFloorTwo = new ParkingFloor(2, [parkingSpotFloor21]);

const vehicles: Vehicle[] = [car1, car2, bike1];

for(const vehicle in vehicles) {

}
