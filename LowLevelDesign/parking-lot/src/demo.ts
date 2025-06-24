import { ParkingFloor } from "./parking-floor";
import { ParkingLot } from "./parking-lot";
import { ParkingSpot } from "./parking-spot";
import { Card } from "./payment/card";
import { VehicleFactory } from "./vehicle/vechicle-factory";
import { Vehicle } from "./vehicle/vehicle";
import { VehicleType } from "./vehicle/vehicle-type";

const parkingLot = ParkingLot.getInstance();

const car1 = VehicleFactory.createVehicle("Car", "CAR123");
const car2 = VehicleFactory.createVehicle("Car", "CAR345");

const bike1 = VehicleFactory.createVehicle("Bike", "BIKE123");
const bike2 = VehicleFactory.createVehicle("Bike", "BIKE345");

const parkingSpotFloor11 = new ParkingSpot(1, VehicleType.BIKE);
const parkingSpotFloor12 = new ParkingSpot(2, VehicleType.CAR);

const parkingSpotFloor21 = new ParkingSpot(1, VehicleType.CAR);

const parkingFloorOne = new ParkingFloor(1, [parkingSpotFloor11, parkingSpotFloor12]);
const parkingFloorTwo = new ParkingFloor(2, [parkingSpotFloor21]);

parkingLot.addFloor(parkingFloorOne);
parkingLot.addFloor(parkingFloorTwo);

const vehicles: Vehicle[] = [car1, car2, bike1, bike2];
const tickets = [];
for (const vehicle of vehicles) {
    try {
        const ticket = parkingLot.parkVehicle(vehicle);
        tickets.push(ticket);
    } catch (error) {
        console.log(`Unable to park ${vehicle.vehicleType} with license plate ${vehicle.licenseNo}.`)
    }
}

for (const ticket of tickets) {
    parkingLot.unParkVehicle(ticket, new Card());
}
