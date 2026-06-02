def allPossibleMoves(a, b, x, y):
    moves = set()
    moves.add((x + a, y + b))
    moves.add((x + a, y - b))

    moves.add((x - a, y + b))
    moves.add((x - a, y - b))

    moves.add((x-b, y+a))
    moves.add((x+b, y+ a))

    moves.add((x + b, y-a))
    moves.add((x - b, y-a))

    return moves

def numberOfPos(x, y, kx, ky, qx, qy):
    knightPositonsToKillKing = allPossibleMoves(x, y, kx, ky)
    knightPositonsToKillQueen = allPossibleMoves(x, y, qx, qy)

    return len(knightPositonsToKillKing & knightPositonsToKillQueen)


t = int(input())
for i in range(t):
    (x, y) = map(int, input().split())
    (kx, ky) = map(int, input().split())
    (qx, qy) = map(int, input().split())

    print(numberOfPos(x, y, kx, ky, qx, qy))
