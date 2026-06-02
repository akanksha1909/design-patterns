import unittest
from voting_app import VotingApplication
class TestVotingApp(unittest.TestCase):  

    def test_strategy_1(self):
        self.ballots = [
            ["A", "B", "C"],       # A=3, B=2, C=1
            ["B", "A"],            # B=3, A=2
            ["C"],                 # C=3
            ["D", "B", "C"]        # D=3, B=2, C=1
        ]
        self.votingApp = VotingApplication(self.ballots)
        self.assertEqual(self.votingApp.rank_teams(1), ["B", "A", "C", "D"])

    def test_strategy_timestamp_ties(self):
        self.ballots = [
            ["A", "B"],   # A and B both start with high points
            ["B", "A"],   # B reaches the same total earlier
        ]
        self.votingApp = VotingApplication(self.ballots)
        self.assertEqual(self.votingApp.rank_teams(1)[0], "B")

    def test_one_candidate_only(self):
        self.ballots = [["A"], ["A"]]
        self.votingApp = VotingApplication(self.ballots)
        self.assertEqual(self.votingApp.rank_teams(1), ["A"])
        self.assertEqual(self.votingApp.rank_teams(2), ["A"])


if __name__ == '__main__':
    unittest.main()