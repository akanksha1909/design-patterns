def minNumberOfMoves(x, k):
    minMoves = 1
    jumps = [x]
    if x % k == 0:
        jumps = [x-1, 1]
        minMoves = 2

    return [jumps, minMoves]

t = int(input())
for i in range(t):
    x, k = map(int, input().split())

    # x, k = 10, 2
    (jumps, minMoves) = minNumberOfMoves(x, k)
    print(minMoves)
    print(*jumps)

