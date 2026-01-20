/**
 * Represents a geographical location with latitude and longitude
 */
export class Location {
    latitude: number;
    longitude: number;
    address: string;

    constructor(latitude: number, longitude: number, address: string) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
    }

    /**
     * Calculate distance between two locations using Haversine formula
     * Returns distance in kilometers
     */
    calculateDistance(other: Location): number {
        const EARTH_RADIUS_KM = 6371;
        
        const lat1Rad = this.toRadians(this.latitude);
        const lat2Rad = this.toRadians(other.latitude);
        const deltaLat = this.toRadians(other.latitude - this.latitude);
        const deltaLon = this.toRadians(other.longitude - this.longitude);

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                   Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    toString(): string {
        return `Location{latitude=${this.latitude}, longitude=${this.longitude}, address='${this.address}'}`;
    }
}

