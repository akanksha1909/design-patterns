import { ParkingTicket } from "../ticket/parking-ticket";

export interface FeeStrategy {
    calculateFee(ticket: ParkingTicket): number;
}