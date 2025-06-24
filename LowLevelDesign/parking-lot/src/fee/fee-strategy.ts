import { ParkingTicket } from "../parking-ticket";

export interface FeeStrategy {
    calculateFee(ticket: ParkingTicket): number;
}