import heapq

class AuthenticationManager:

    def __init__(self, timeToLive: int):
        self.timeToLive = timeToLive
        self.tokens = {} # tokenId: expiryTime
        self.minHeap = [] # (expiryTime, tokenId)

    def generate(self, tokenId: str, currentTime: int) -> None:
        self.tokens[tokenId] = currentTime + self.timeToLive
        heapq.heappush(self.minHeap, (currentTime + self.timeToLive, tokenId))

    def renew(self, tokenId: str, currentTime: int) -> None:
        expiryTime = self.tokens[tokenId]
        if expiryTime <= currentTime:
            self.tokens[tokenId] = currentTime + self.timeToLive
            heapq.heappush(self.minHeap, (currentTime + self.timeToLive, tokenId))

    def countUnexpiredTokens(self, currentTime: int) -> int:
        count = 0
        while True:
            if len(self.minHeap) == 0: break
            while self.minHeap and self.minHeap[0][0] != self.tokens[self.minHeap[0][1]]:
                heapq.heappop(self.minHeap)
                
            if self.minHeap[0][0] <= currentTime:
                count += 1
        return count


# Your AuthenticationManager object will be instantiated and called as such:
timeToLive = 5
tokenId = 23
currentTime = 1

obj = AuthenticationManager(timeToLive)
obj.generate(tokenId, currentTime)
obj.renew(tokenId,currentTime)
param_3 = obj.countUnexpiredTokens(currentTime)