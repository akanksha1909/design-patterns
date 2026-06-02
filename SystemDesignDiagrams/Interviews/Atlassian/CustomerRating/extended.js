class SupportRatingSystem {
    constructor() {
        this.ratings = new Map();
    }

    addRating(agent, rating, date) {
        const month = date ? date.slice(0, 7) : "all";
        if (!this.ratings.has(agent)) {
            this.ratings.set(agent, new Map())
        }
        const agentMap = this.ratings.get(agent);
        if (!agentMap.has(month)) {
            agentMap.set(month, []);
        }
        agentMap.get(month).push(rating);
    }

    getAverageRatings(month = "all") {
        const result = []
        for (const [agent, monthsMap] of this.ratings) {
            if (!monthsMap.get(month)) {
                continue
            }
            const monthRating = monthsMap.get(month);
            const agentMonthAvg = monthRating.reduce((acc, curr) => acc + curr, 0) / monthRating.length;
            result.push({ agent, avg: agentMonthAvg })
        }
        result.sort((a, b) => b.avg - a.avg);
        return result;
    }

    getTopAgentsByMonth(month = "all") {

    }

    bestAgentsEachMonth() {
        const monthWise = new Map();
        for (const [agent, monthMap] of this.ratings) {
            for (const [month, rating] of monthMap) {
                const avg = rating.reduce((a, b) => a + b, 0) / rating.length;
                if (!monthWise.has(month)) {
                    monthWise.set(month, []);
                }
                monthWise.get(month).push({ agent, avg });
            }
        }

        const result = {};
        for (const [month, list] of monthWise) {
            list.sort((a, b) => b.avg - a.avg);
            const bestScore = list[0].avg;
            result[month] = list.filter((item) => item.avg == bestScore).map(item => item.agent);
        }
        return result;

    }
}

const sys = new SupportRatingSystem();

sys.addRating("Alice", 4, "2025-01-12");
sys.addRating("Alice", 5, "2025-01-20");
sys.addRating("Bob", 3, "2025-01-18");
sys.addRating("Bob", 5, "2025-02-01");

console.log(sys.getAverageRatings("2025-01"));  // Monthly comparison
console.log(sys.getTopAgentsByMonth("2025-02")); // Best in February
console.log(sys.bestAgentsEachMonth());


module.exports = SupportRatingSystem