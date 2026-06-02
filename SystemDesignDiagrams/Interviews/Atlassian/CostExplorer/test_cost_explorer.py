import unittest
from datetime import date
from index import CostExplorer, Plan

class TestCostExplorer(unittest.TestCase):

    def test_monthly_cost_before_subscription(self):
        start = date(2025, 6, 10)
        today = date(2025, 12, 1)

        explorer = CostExplorer(Plan.BASIC, start, today)
        result = explorer.monthly_costs()

        # Jan - May should be zero
        for month in range(5):
            self.assertEqual(result[month]["cost"], 0)

        # June - Dec
        for month in range(5, 12):
            self.assertEqual(result[month]["cost"], Plan.BASIC)

    def test_yearly_basic_plan(self):

        start = date(2025, 6, 10)
        today = date(2025, 12, 1)

        explorer = CostExplorer(Plan.BASIC, start, today)
        result = explorer.monthly_costs()

        monthly_sum = 0
        for month in range(12):
            monthly_sum += result[month]["cost"]
        
        self.assertEqual(monthly_sum, explorer.yearly_estimate())

    def test_subscription_start_in_december(self):
        start = date(2025, 12, 1)
        today = date(2025, 12, 25)

        explorer = CostExplorer(Plan.PREMIUM, start, today)
        result = explorer.monthly_costs()

        for month in range(11):
            self.assertEqual(result[month]["cost"], 0)

        self.assertEqual(result[11]["cost"], Plan.PREMIUM)

    def test_plan_validation(self):
        self.assertEqual(Plan.BASIC, 9.99)
        self.assertEqual(Plan.STANDARD, 49.99)
        self.assertEqual(Plan.PREMIUM, 249.99)


if __name__ == '__main__':
    unittest.main()
