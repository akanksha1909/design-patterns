class TicTacToe:

    def __init__(self, n: int):
        self.n = n
        self.rows = [0 for i in range(n)]
        self.cols = [0 for j in range(n)]
        self.diag = 0
        self.antiDiag = 0
        

    def move(self, row: int, col: int, player: int) -> int:
        mark = -1
        if player == 1:
            mark = 1
        
        self.rows[row] += mark
        self.cols[col] += mark

        if row == col:
            self.diag += mark

        if (row + col) == (self.n - 1):
            self.antiDiag += mark
        
        if abs(self.rows[row]) == self.n or abs(self.cols[col]) == self.n or abs(self.diag) == self.n or abs(self.antiDiag) == self.n:
            return player
        return 0
        

# Your TicTacToe object will be instantiated and called as such:
# obj = TicTacToe(n)
# param_1 = obj.move(row,col,player)