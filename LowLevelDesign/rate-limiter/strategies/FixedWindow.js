(async function main() {
    class FixedWindowAlgorithm {
        constructor(maxRequests, windowSize) {
            this.maxRequests = maxRequests;
            this.windowSize = windowSize;
            this.userRequestInfo = new Map();  // userId -> UserRequest
        }

        allowRequest(userId) {
            if (!this.userRequestInfo.has(userId)) {
                this.userRequestInfo.set(userId, new UserRequest())
            }
            const userRequest = this.userRequestInfo.get(userId)
            const currentTime = Date.now()
            if (currentTime - userRequest.windowStartTime < this.windowSize) {
                if (userRequest.currentRequests < this.maxRequests) {
                    userRequest.currentRequests += 1
                    console.log("Request allowed", currentTime - userRequest.windowStartTime)
                } else {
                    console.log("Request Denied", currentTime - userRequest.windowStartTime)
                }
            } else {
                console.log("Request allowed", currentTime - userRequest.windowStartTime)

                userRequest.currentRequests = 1
                userRequest.windowStartTime = currentTime
            }
        }
    }

    class UserRequest {
        constructor() {
            this.currentRequests = 0;
            this.windowStartTime = Date.now();
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // 5 requests in 5 seconds
    let maxRequests = 5
    let windowSize = 5 * 1000
    const fixedWindow = new FixedWindowAlgorithm(maxRequests, windowSize)

    for (let i = 0; i < 20; i++) {
        fixedWindow.allowRequest("user-1")
        await sleep(500)
    }
}());