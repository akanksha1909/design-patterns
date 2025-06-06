const Redis = require('ioredis');
const redis = new Redis();

const leaderboardKey = 'game:leaderboard';

function updateUserScore(name, score) {
    redis.zadd(leaderboardKey, score, name)
}

function getTopKUsers(k) {
    return redis.zrevrange(leaderboardKey, 0, k - 1, 'WITHSCORES')
}

function getRankOfAUser(name) {
    return redis.zrevrank(leaderboardKey, name)
}

function getScoreOfAUser(name) {
    return redis.zscore(leaderboardKey, name)
}

async function main() {
    await updateUserScore("Akanksha", 1000);
    await updateUserScore("Anshuman", 1800);
    await updateUserScore("Adarsh", 1600);

    console.log("Score: ", await getScoreOfAUser("Adarsh"))

    console.log("Top K Users:", await getTopKUsers(3))

    console.log("Rank of a User:", await getRankOfAUser("Akanksha"));
}

main()
    .catch(console.error)
    .finally(() => {
        redis.quit().then(() => process.exit(0));
    });