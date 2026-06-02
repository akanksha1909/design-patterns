import unittest
from index import TicTacToe

class TestTicTacToe(unittest.TestCase):

    def setUp(self):
        self.tictac = TicTacToe(3)

    def test_winning_player(self):
        self.tictac.move(0, 0, 1)
        self.tictac.move(1, 0, 2)
        self.tictac.move(1, 1, 1)
        self.assertEqual(self.tictac.move(2, 0, 2), 0)
        self.assertEqual(self.tictac.move(2, 2, 1), 1)

        
if __name__ == '__main__':
    unittest.main()