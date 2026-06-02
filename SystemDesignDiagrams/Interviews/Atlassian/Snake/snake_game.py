from collections import deque
class SnakeGame:
    def __init__(self, width, height, food):
        self.width = width
        self.height = height
        self.food = food
        self.snake = deque([(0, 0)])
        self.body_pos = set([(0, 0)])
        self.score = 0
        self.current_food_index = 0
        self.directions = { 'R': [0, 1], 'L': [0, -1], 'U': [-1, 0], 'D': [1, 0] }

    def _isValid(self, row, col):
        return row >= 0 and row < self.height and col >= 0 and col < self.width

    def move(self, direction):
        current_head_r, current_head_c = self.snake[-1]
        new_head_r, new_head_c = current_head_r + self.directions[direction][0], current_head_c + self.directions[direction][1]

        tail_r, tail_c = self.snake[0]

        if not self._isValid(new_head_r, new_head_c):
            return -1
        
        if (new_head_r, new_head_c) in self.body_pos and new_head_r != tail_r and new_head_c != tail_c: return -1

        food_index_r, food_index_c = self.food[self.current_food_index]
        if self.current_food_index < len(self.food) and new_head_r == food_index_r and new_head_c == food_index_c:
            self.score += 1
            self.current_food_index += 1
        else:
            self.body_pos.remove((tail_r, tail_c))
            self.snake.popleft()
        
        self.body_pos.add((new_head_r, new_head_c))
        self.snake.append((new_head_r, new_head_c))

        return self.score
    
# game = SnakeGame(3, 2, [[1, 2], [0, 1]])
# print(game.move("R"))
# print(game.move("D"))
# print(game.move("R"))
# print(game.move("U"))
# print(game.move("L"))
# print(game.move("U"))