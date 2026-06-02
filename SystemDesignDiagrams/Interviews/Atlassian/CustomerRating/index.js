class SupportRatingSystem {
    constructor() {
        this.ratings = new Map();
    }

    addRating(agent, rating) {
        if (!this.ratings.has(agent)) {
            this.ratings.set(agent, [])
        } 
        this.ratings.get(agent).push(rating);   
    }

    getAvgRatings() {
        const result = [];
        for (const [key, value] of this.ratings) {
            const avgRating = value.reduce((acc, curr) => acc + curr, 0) / value.length;
            result.push({ agent: key, avg: avgRating })
        }
        return result.sort((a, b) => b.avg - a.avg);
    }
}

const s = new SupportRatingSystem();
s.addRating("Alice", 4)
s.addRating("Alice", 5)
s.addRating("Alice", 1)
s.addRating("Bob", 4);
s.addRating("Bob", 8);
console.log(s.getAvgRatings())