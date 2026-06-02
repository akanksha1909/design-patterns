def minCost(strings, n):
    max_cost = 0
    count = 1
    for i in range(1, n):
        if strings[i] == strings[i-1]:
            count += 1
        else:
            max_cost = max(max_cost, count)
            count = 1
            
    max_cost = max(max_cost, count)

    return max_cost + 1


t = int(input())

for i in range(t):
    n = int(input())
    strings = input()

    print(minCost(strings,n))