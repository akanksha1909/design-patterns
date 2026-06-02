class VotingApplication:
    def __init__(self, ballots):
        self.ballots = ballots
        self.scores = {} # candidate: score
        self.position_counts = {} # candidate: [first_pos, second_pos, third_pos....]
        self.score_history = {} # candidate: [score, time]
        self.max_positions = float("-inf")

        for ballot in ballots:
            self.max_positions = max(self.max_positions, len(ballot))


    def rank_teams(self, strategy):
        time = 0
        for (t, ballot) in enumerate(self.ballots):
            for (pos, candidate) in enumerate(ballot):
                if candidate not in self.scores:
                    self.scores[candidate] = 0
                    self.position_counts[candidate] = [0] * self.max_positions
                    self.score_history[candidate] = []
                
                self.scores[candidate] += (self.max_positions - pos)
                self.position_counts[candidate][pos] += 1
                self.score_history[candidate].append((self.scores[candidate], time))
                time += 1
        
        candidates = list(self.scores.keys())
        if strategy == 1:
            reach_time = {} # candidate: time
            for (candidate, final_score) in self.scores.items():
                for (score, t) in self.score_history[candidate]:
                    if score == final_score:
                        reach_time[candidate] = t
                        break
            candidates.sort(key=lambda x: (-self.scores[x], reach_time[x], x))
        else:
            candidates.sort(key=lambda x: tuple([-self.scores[x]] + [-count for count in self.position_counts[x]] + [x]))

        return candidates


ballots = [
    ["A", "B", "C"],       # A=3, B=2, C=1
    ["B", "A"],            # B=3, A=2
    ["C"],                 # C=3
    ["D", "B", "C"]        # D=3, B=2, C=1
]

s = VotingApplication(ballots)
print(s.rank_teams(2))
# print(s.rank_teams(2))

