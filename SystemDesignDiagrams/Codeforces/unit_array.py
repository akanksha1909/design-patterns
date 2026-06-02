def minOperations(numbers):
    negativeCount = 0
    positiveCount = 0
    ops = 0
    n = len(numbers)

    for num in numbers:
        if num == -1: negativeCount += 1
        else:
            positiveCount += 1

    if positiveCount < negativeCount:

        expectedNegative = n // 2
    
        ops += negativeCount - expectedNegative
        negativeCount -= ops
    
    if negativeCount % 2 == 1: ops += 1

    return ops

# numbers = [1, 1, -1, 1]
# print(minOperations(numbers))

t = int(input())
for i in range(t):
    n = int(input())
    numbers = list(map(int, input().split()))
    print(minOperations(numbers))

