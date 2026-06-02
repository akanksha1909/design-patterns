def minVolume(gasStations, x):
    currentPos = 0
    min_capacity = 1
    for station in gasStations:
        distance = station - currentPos
        min_capacity = max(min_capacity, distance)
        currentPos = station

    return max(min_capacity, 2 * (x - currentPos))


t = int(input())
for i in range(t):
    n, x = map(int, input().split())
    gasStations = list(map(int, input().split()))
    print(minVolume(gasStations, x))