# Uber Ride App - Low-Level Design (LLD)

A comprehensive TypeScript/Node.js implementation of an Uber-like ride-sharing application with complete trip lifecycle management.

## Features

✅ **Ride Request**: Riders can request rides by specifying pickup/drop-off locations and preferred ride type  
✅ **Driver Matching**: Automatic notification of nearby available drivers  
✅ **Driver Actions**: Drivers can accept/reject requests, start and end trips  
✅ **Trip Status Management**: Complete lifecycle tracking (REQUESTED → DRIVER_ASSIGNED → DRIVER_ARRIVED → IN_PROGRESS → COMPLETED)  
✅ **Real-time Notifications**: Riders and drivers receive notifications for all status changes  
✅ **Trip History**: Both riders and drivers maintain their complete trip history  

## Architecture

### Project Structure

```
uber-ride-app/
├── models/              # Core entity classes
│   ├── Location.js      # Geographical location with distance calculation
│   ├── Rider.js         # Rider/user entity
│   ├── Driver.js        # Driver entity with availability and rating
│   ├── Vehicle.js       # Vehicle information
│   └── Trip.js          # Trip entity (Subject) with lifecycle management
├── enums/               # Enumerations
│   ├── TripStatus.js    # Trip state machine
│   └── RideType.js      # Available ride types (Economy, Premium, Luxury, etc.)
├── patterns/            # Design pattern implementations
│   ├── Observer.js      # Observer interface
│   └── Subject.js       # Subject interface for Observer pattern
├── observers/           # Observer implementations
│   ├── RiderObserver.js # Observer for rider notifications
│   └── DriverObserver.js # Observer for driver notifications
├── services/            # Business logic layer
│   ├── TripService.js           # Core trip management service
│   ├── DriverMatchingService.js # Driver-rider matching algorithm
│   └── NotificationService.js   # Notification handling
├── repositories/        # Data access layer
│   ├── RiderRepository.js
│   ├── DriverRepository.js
│   └── TripRepository.js
├── UberRideApp.js       # Main application orchestrator
├── index.js             # Example usage/demo
├── package.json
└── README.md
```

## Core Components

### 1. Models

#### **Location**
- Stores latitude, longitude, and address
- Calculates distance between two locations using Haversine formula

#### **Rider**
- User information (ID, name, email, phone)
- Current location tracking
- Trip history

#### **Driver**
- Driver information
- Vehicle association
- Availability status
- Rating and trip count
- Trip history

#### **Vehicle**
- Vehicle details (make, model, year, license plate)
- Supported ride type

#### **Trip**
- Complete trip information
- Status tracking through lifecycle
- Fare calculation based on distance and ride type
- Timestamps for each stage
- **Implements Subject pattern**: Automatically notifies observers (riders/drivers) when status changes

### 2. Enums

#### **TripStatus**
- `REQUESTED`: Initial state when rider requests a ride
- `DRIVER_ASSIGNED`: Driver has accepted the request
- `DRIVER_ARRIVED`: Driver reached pickup location
- `IN_PROGRESS`: Trip is ongoing
- `COMPLETED`: Trip finished successfully
- `CANCELLED`: Trip was cancelled

#### **RideType**
- `ECONOMY`: Standard ride (1.0x multiplier)
- `PREMIUM`: Premium ride (1.5x multiplier)
- `LUXURY`: Luxury ride (2.0x multiplier)
- `POOL`: Shared ride (0.7x multiplier)
- `XL`: Extra large vehicle (1.3x multiplier)

### 3. Services

#### **TripService**
Main orchestrator for trip operations:
- Manages observer lifecycle (creates and attaches RiderObserver and DriverObserver to trips)
- `requestRide()`: Create new trip, attach rider observer, and notify nearby drivers
- `acceptRide()`: Assign driver to trip (triggers observer notification automatically)
- `rejectRide()`: Handle driver rejection, find alternative
- `driverArrived()`: Update status (triggers observer notification automatically)
- `startTrip()`: Begin the trip (triggers observer notification automatically)
- `endTrip()`: Complete trip and calculate fare (triggers observer notification automatically)
- `cancelTrip()`: Cancel trip from any state (triggers observer notification automatically)
- **Note**: All status changes automatically notify observers via Observer pattern

#### **DriverMatchingService**
- `findBestDriver()`: Finds closest available driver matching ride type
- `notifyNearbyDrivers()`: Attaches driver observers to trip and notifies compatible drivers within radius

#### **NotificationService**
- Concrete notification implementation used by observers
- Sends notifications for:
  - New ride requests to drivers
  - Driver assignment to riders
  - All trip status changes
  - Trip completion with fare details

### 4. Repositories

In-memory data storage (can be replaced with database):
- `RiderRepository`: Manages rider data
- `DriverRepository`: Manages driver data and availability
- `TripRepository`: Manages trip data and history queries

## Usage Example

```typescript
import { UberRideApp } from './src/UberRideApp';
import { Vehicle } from './src/models/Vehicle';
import { RideType } from './src/enums/RideType';

// Initialize app
const app = new UberRideApp();

// Register users
const rider = app.registerRider('rider1', 'John Doe', 'john@example.com', '+1234567890');
const vehicle = new Vehicle('v1', 'ABC123', 'Toyota', 'Camry', 2020, 'Black', RideType.ECONOMY);
const driver = app.registerDriver('driver1', 'Alice Smith', 'alice@example.com', '+1987654321', vehicle);

// Update locations
app.updateRiderLocation('rider1', 37.7749, -122.4194, '123 Main St');
app.updateDriverLocation('driver1', 37.7849, -122.4094, '456 Market St');

// Request ride
const trip = app.requestRide(
    'rider1',
    37.7749, -122.4194, '123 Main St',      // Pickup
    37.7849, -122.4094, '456 Market St',    // Dropoff
    RideType.ECONOMY
);

// Driver accepts
app.acceptRide('driver1', trip.tripId);

// Driver arrives
app.driverArrived('driver1', trip.tripId);

// Start trip
app.startTrip('driver1', trip.tripId);

// End trip
app.endTrip('driver1', trip.tripId);

// View history
const riderHistory = app.getRiderTripHistory('rider1');
const driverHistory = app.getDriverTripHistory('driver1');
```

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Build TypeScript:
```bash
npm run build
```

3. Run the demo:
```bash
npm start
```

Or run directly with ts-node (development):
```bash
npm run dev
```

## Design Patterns Used

1. **Repository Pattern**: Abstracts data access layer
2. **Service Layer Pattern**: Separates business logic from data access
3. **Observer Pattern**: **Core notification system** - Trip (Subject) notifies observers (RiderObserver, DriverObserver) automatically when status changes
   - **Subject**: `Trip` class extends `Subject` and maintains a list of observers
   - **Observers**: `RiderObserver` and `DriverObserver` implement the `Observer` interface
   - **Benefits**: Decouples notification logic from business logic, allows multiple observers, easy to extend
4. **Strategy Pattern**: Different ride types with varying pricing
5. **State Pattern**: Trip status transitions

### Observer Pattern Implementation Details

The Observer pattern is used extensively for notifications:

- **Trip (Subject)**: When trip status changes via `setStatus()`, `setDriver()`, `startTrip()`, `completeTrip()`, or `cancelTrip()`, it automatically notifies all attached observers
- **RiderObserver**: Listens for trip updates and sends notifications to riders
- **DriverObserver**: Listens for trip updates and sends notifications to drivers
- **Event Types**: 
  - `DRIVER_ASSIGNED`: Triggered when a driver is assigned to a trip
  - `STATUS_CHANGED`: Triggered when trip status changes
  - `RIDE_REQUEST`: Triggered when a ride request is sent to drivers

This design ensures that:
- Notifications are automatically sent when trip state changes
- No need to manually call notification methods in business logic
- Easy to add new observer types (e.g., AdminObserver, AnalyticsObserver)
- Loose coupling between Trip and notification logic

## Key Design Decisions

1. **TypeScript**: Full type safety with strict mode enabled for better code quality and IDE support

2. **In-Memory Storage**: Repositories use Map for simplicity. In production, replace with database (MongoDB, PostgreSQL, etc.)

3. **Distance Calculation**: Uses Haversine formula for accurate geographical distance

4. **Driver Matching**: Prioritizes closest available driver matching ride type

5. **Fare Calculation**: Base fare + (distance × per-km rate) × ride type multiplier

6. **Status Management**: Strict state transitions ensure data integrity

7. **Notification System**: Console-based for demo. In production, integrate with:
   - Push notification services (FCM, APNS)
   - SMS services (Twilio)
   - Email services (SendGrid)

## Future Enhancements

- [ ] Payment integration
- [ ] Rating system for riders and drivers
- [ ] Real-time location tracking
- [ ] Route optimization
- [ ] Surge pricing
- [ ] Multiple stop trips
- [ ] Scheduled rides
- [ ] Database persistence
- [ ] REST API endpoints
- [ ] WebSocket for real-time updates
- [ ] Unit tests

## License

ISC

