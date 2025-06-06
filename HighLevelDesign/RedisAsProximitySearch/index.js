const Redis = require('ioredis');
const redis = new Redis();

async function seedLocations() {
    await redis.geoadd("places", 77.5946, 12.9716, "Bangalore_Burger");
    await redis.geoadd("places", 77.1025, 28.7041, "Delhi_Biryani");
    await redis.geoadd("places", 72.8777, 19.0760, "Mumbai_Pizza");
    await redis.geoadd("places", 78.4867, 17.3850, "Hyderabad_Thali");

    console.log("📌 Locations added!");
}

async function findNearBy(long, lat, radiusKm = 500) {
    const results = await redis.geosearch(
        "places",
        "FROMLONLAT", long, lat,
        "BYRADIUS", radiusKm, "km",
        "WITHDIST",
        "ASC"
    );

    console.log(`📍 Places within ${radiusKm}km:`);
    results.forEach(([name, distance]) => {
        console.log(`→ ${name} is ${distance} km away`);
    });
}

(async () => {
    await seedLocations()

    const bangalore = { long: 77.5946, lat: 12.9716 };
    await findNearBy(bangalore.long, bangalore.lat, 500);
    process.exit();
})();

