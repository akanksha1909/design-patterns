import heapq
class StockPrice:

    def __init__(self):
        self.timestamps = {} # timestamp: price
        self.maxHeap = [] # price, timestamp
        self.minHeap = [] # price, timestamp
        self.latestTimestamp = 0

    def update(self, timestamp, price):
        self.timestamps[timestamp] = price
        self.latestTimestamp = max(self.latestTimestamp, timestamp)
        heapq.heappush(self.minHeap, (price, timestamp))
        heapq.heappush(self.maxHeap, (-price, timestamp))

    def current(self):
        return self.timestamps[self.latestTimestamp]

    def maximum(self):
        while self.maxHeap and -self.maxHeap[0][0] != self.timestamps[self.maxHeap[0][1]]:
            heapq.heappop(self.maxHeap)

        return -self.maxHeap[0][0] if len(self.maxHeap) else ""

    def minimum(self):
        while self.minHeap and self.minHeap[0][0] != self.timestamps[self.minHeap[0][1]]:
            heapq.heappop(self.minHeap)
        
        return self.minHeap[0][0] if len(self.minHeap) else ""

s = StockPrice()
s.update(1, 10)
s.update(2, 5)
print(s.current())
print(s.maximum())
s.update(1, 3)
print(s.maximum())
s.update(4, 2)
print(s.minimum())

