export interface Appointment {
    hostId: string;
    guestId: string;
    startTimeUTC: string;
    endTimeUTC: string;
    createdAt: Date;
}