def makeItBeautiful(numbers):
    numbers.sort()

    numbers[0], numbers[n-1] = numbers[n-1], numbers[0]
    numbers[1], numbers[n-1] = numbers[n-1], numbers[1]

    return numbers


def allElementsEqual(numbers):
    num = numbers[0]

    for i in range(1, len(numbers)):
        if numbers[i] != num:
            return False
    return True

t = int(input())
for i in range(t):
    n = int(input())
    numbers = list(map(int, input().split()))
    if allElementsEqual(numbers):
        print("NO")
    else:
        result = makeItBeautiful(numbers)
        print("YES")
        print(*result)