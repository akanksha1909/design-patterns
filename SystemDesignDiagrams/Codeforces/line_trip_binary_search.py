def possibleToReachX(capacity, destination, gasStations):
    currentPos = 0

    for station in gasStations:
        if station - currentPos > capacity:
            return False
        currentPos = station

    if 2*(destination - currentPos) > capacity: return False
    return True
        
def minVolume(gasStations, x):
    low = 1
    high = 2*x
    ans = high
    while low <= high:
        mid = (low + high) // 2
        if possibleToReachX(mid, x, gasStations):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
    return ans

t = int(input())
for i in range(t):
    n, x = map(int, input().split())
    gasStations = list(map(int, input().split()))
    print(minVolume(gasStations, x))