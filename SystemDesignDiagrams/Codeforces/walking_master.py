def minNoOfMoves(source_x, source_y, dest_x, dest_y):
    if dest_y < source_y: return -1

    diagonalMoves = (dest_y - source_y)
    source_x += diagonalMoves
    source_y += diagonalMoves
    
    if source_x < dest_x: return -1
    leftHorizonalMoves = source_x - dest_x
    return diagonalMoves + leftHorizonalMoves
    
t = int(input())
for i in range(t):
    (a, b, c, d) = map(int, input().split())
    moves = minNoOfMoves(a, b, c, d)
    print(moves)

    