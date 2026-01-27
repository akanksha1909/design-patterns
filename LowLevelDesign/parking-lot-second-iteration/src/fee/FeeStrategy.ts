import { Ticket } from "../entities/Ticket"

export interface FeeStrategy {
    calculateFee(ticket: Ticket, exitTime: number): number
}