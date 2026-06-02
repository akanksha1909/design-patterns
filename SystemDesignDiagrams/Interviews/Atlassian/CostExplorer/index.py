from datetime import date

class Plan:
    BASIC = 9.99
    STANDARD = 49.99
    PREMIUM = 249.99

class CostExplorer:
    def __init__(self, plan_price, start_date, today):
        self.plan_price = plan_price
        self.start_date = start_date
        self.today = today

    def monthly_costs(self):
        year = self.today.year
        monthly_report = []

        for month in range(1, 13):
            month_start = date(year, month, 1)

            if month_start < date(self.start_date.year, self.start_date.month, 1):
                monthly_report.append({ "month": month, "cost": 0 })
                continue

            monthly_report.append({ "month": month, "cost": self.plan_price })
        return monthly_report

    def yearly_estimate(self):
        totalSum = 0
        for monthly_report in self.monthly_costs():
            totalSum += monthly_report["cost"]
        
        return totalSum


start = date(2025, 4, 15)
today = date(2025, 12, 1)

explorer = CostExplorer(Plan.STANDARD, start, today)
print(explorer.monthly_costs())
print(explorer.yearly_estimate())


