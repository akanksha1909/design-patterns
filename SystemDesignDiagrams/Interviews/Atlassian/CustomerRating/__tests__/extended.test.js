const SupportRatingSystem = require('../extended');


describe("SupportRatingSystem", () => {
    let system;
    beforeEach(() => {
        system = new SupportRatingSystem();
    });

    test("should add ratings of agents correctly", () => {
        system.addRating("Alice", 5, "2025-01-10");
        system.addRating("Alice", 4, "2025-01-15");
        const janRatings = system.ratings.get("Alice").get("2025-01");
        expect(janRatings).toEqual([5, 4]);
    });

    test("should return best agent for each month", () => {
        system.addRating("Alice", 5, "2025-01-10");
        system.addRating("Alice", 4, "2025-01-15");
        system.addRating("Bob", 5, "2025-02-10");
        system.addRating("Bob", 8, "2025-02-10");
        const best = system.bestAgentsEachMonth();
        expect(best["2025-01"]).toEqual(["Alice"]);
        expect(best["2025-02"]).toEqual(["Bob"]);
    });

    test("should handle ties properly", () => {
        system.addRating("Alice", 5, "2025-01-10");
        system.addRating("Bob", 5, "2025-01-10");
        const best = system.bestAgentsEachMonth();
        expect(best["2025-01"]).toEqual(["Alice", "Bob"]);
    });

    test("should return empty object if no ratings available", () => {
        const best = system.bestAgentsEachMonth();
        expect(best["2025-01"]).toEqual({});
    });
});