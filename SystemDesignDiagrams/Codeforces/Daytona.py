def doesExists(numbers, k):
    if k in numbers: return "YES"
    return "NO"


t = int(input())
for i in range(t):
    n, k = map(int, input().split())
    numbers = list(map(int, input().split()))
    print(doesExists(numbers, k))