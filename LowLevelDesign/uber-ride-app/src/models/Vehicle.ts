import { RideTypeConfig } from '../enums/RideType';

/**
 * Represents a vehicle owned by a driver
 */
export class Vehicle {
    vehicleId: string;
    licensePlate: string;
    make: string;
    model: string;
    year: number;
    color: string;
    supportedRideType: RideTypeConfig;

    constructor(
        vehicleId: string,
        licensePlate: string,
        make: string,
        model: string,
        year: number,
        color: string,
        supportedRideType: RideTypeConfig
    ) {
        this.vehicleId = vehicleId;
        this.licensePlate = licensePlate;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.supportedRideType = supportedRideType;
    }

    toString(): string {
        return `Vehicle{vehicleId='${this.vehicleId}', licensePlate='${this.licensePlate}', make='${this.make}', model='${this.model}', year=${this.year}, color='${this.color}', supportedRideType=${this.supportedRideType.displayName}}`;
    }
}

