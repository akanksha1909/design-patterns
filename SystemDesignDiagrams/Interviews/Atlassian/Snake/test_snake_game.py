import unittest
from snake_game import SnakeGame

class TestSnakeGame(unittest.TestCase):

    def setUp(self):
        self.width = 3
        self.height = 2
        self.food = [[1, 2], [0, 1]]
        self.snake_game = SnakeGame(self.width, self.height, self.food)

    def test_isValid_boundaries(self):
        self.assertTrue(self.snake_game._isValid(0, 0))
        self.assertTrue(self.snake_game._isValid(1, 2))
        self.assertFalse(self.snake_game._isValid(2, 3))

    def test_move_right(self):
        self.snake_game.move("R")
        self.assertEqual(0, self.snake_game.score)
        self.assertIn((0, 1), self.snake_game.body_pos)

    def test_move_down_eat_food(self):
        self.snake_game.move("R")
        self.snake_game.move("D") # (1, 1)

        self.assertEqual(0, self.snake_game.score)
        self.snake_game.move("R")
        self.assertEqual(1, self.snake_game.score)
        self.assertEqual(1, self.snake_game.current_food_index)
        self.assertIn((1, 2), self.snake_game.body_pos)

    def test_collision_with_wall(self):
        score = self.snake_game.move("L")
        self.assertEqual(-1, score)

    def test_self_collison(self):
        self.snake_game.move("D")
        self.snake_game.move("R")
        self.snake_game.move("R")

        score = self.snake_game.move("R")
        self.assertEqual(score, -1)

if __name__ == '__main__':
    unittest.main()