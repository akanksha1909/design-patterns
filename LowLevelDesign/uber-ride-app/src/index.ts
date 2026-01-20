import { UberRideApp } from './UberRideApp';
import { Vehicle } from './models/Vehicle';
import { RideType } from './enums/RideType';

/**
 * Example usage of the Uber Ride App
 */
function main(): void {
    console.log('🚗 Initializing Uber Ride App...\n');

    // Initialize the app
    const app = new UberRideApp();

    // Register a rider
    const rider = app.registerRider('rider1', 'John Doe', 'john@example.com', '+1234567890');
    console.log(`✅ Registered rider: ${rider.name}\n`);

    // Register drivers
    const vehicle1 = new Vehicle('v1', 'ABC123', 'Toyota', 'Camry', 2020, 'Black', RideType.ECONOMY);
    const driver1 = app.registerDriver('driver1', 'Alice Smith', 'alice@example.com', '+1987654321', vehicle1);
    console.log(`✅ Registered driver: ${driver1.name} with ${vehicle1.make} ${vehicle1.model}\n`);

    const vehicle2 = new Vehicle('v2', 'XYZ789', 'BMW', '5 Series', 2021, 'White', RideType.PREMIUM);
    const driver2 = app.registerDriver('driver2', 'Bob Johnson', 'bob@example.com', '+1555555555', vehicle2);
    console.log(`✅ Registered driver: ${driver2.name} with ${vehicle2.make} ${vehicle2.model}\n`);

    // Update locations
    app.updateRiderLocation('rider1', 37.7749, -122.4194, '123 Main St, San Francisco');
    app.updateDriverLocation('driver1', 37.7849, -122.4094, '456 Market St, San Francisco');
    app.updateDriverLocation('driver2', 37.7649, -122.4294, '789 Mission St, San Francisco');
    console.log('📍 Updated locations for rider and drivers\n');

    // Rider requests a ride
    console.log('📞 Rider requesting a ride...');
    const trip = app.requestRide(
        'rider1',
        37.7749, -122.4194, '123 Main St, San Francisco',  // Pickup
        37.7849, -122.4094, '456 Market St, San Francisco', // Dropoff
        RideType.ECONOMY
    );
    console.log(`✅ Trip created: ${trip.tripId}\n`);

    // Driver accepts the ride
    console.log('👋 Driver accepting the ride...');
    app.acceptRide('driver1', trip.tripId);
    console.log(`✅ Driver ${driver1.name} accepted the trip\n`);

    // Driver arrives at pickup
    console.log('🚗 Driver arriving at pickup location...');
    app.driverArrived('driver1', trip.tripId);
    console.log('✅ Driver arrived\n');

    // Driver starts the trip
    console.log('▶️  Driver starting the trip...');
    app.startTrip('driver1', trip.tripId);
    console.log('✅ Trip started\n');

    // Driver ends the trip
    console.log('🏁 Driver ending the trip...');
    app.endTrip('driver1', trip.tripId);
    console.log('✅ Trip completed\n');

    // Display trip history
    console.log('📜 Rider Trip History:');
    const riderHistory = app.getRiderTripHistory('rider1');
    riderHistory.forEach((trip, index) => {
        console.log(`  ${index + 1}. Trip ${trip.tripId} - Status: ${trip.status}, Fare: $${trip.fare.toFixed(2)}`);
    });

    console.log('\n📜 Driver Trip History:');
    const driverHistory = app.getDriverTripHistory('driver1');
    driverHistory.forEach((trip, index) => {
        console.log(`  ${index + 1}. Trip ${trip.tripId} - Status: ${trip.status}, Fare: $${trip.fare.toFixed(2)}`);
    });

    console.log('\n✨ Demo completed!');
}

// Run the example
main();

export { main };

