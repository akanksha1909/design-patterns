# wxyz
# [wwww, wwwx, wwwy, wwwz]

digits = "23"

# 0 <= digits.length <= 4
# digits[i] is a digit in the range ['2', '9']

# TC: O(n*pow(n, n))



9999
- (4) - (4) - (4) - (4)


digitToCharMap = {
    "2": "abc",
    "3": "def",
    "4": "ghi",
    "5": "jkl",
    "6":"mno",
    "7": "pqrs",
    "8": "tuv",
    "9": "wxyz"
}


def helper(index, currentString, result):
    
    if len(currentString) == len(digits):
        result.append(currentString)
        return

    char = digits[index]
    s = digitToCharMap[char]
    for i in range(len(s)):
        helper(index + 1, currentString + s[i], result)


result = []

helper(0, "", result)
print(result, len(result))