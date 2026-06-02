class Solution:
    def doesOverlap(self, interval_one, interval_two):
        (start_one, end_one) = interval_one
        (start_two, end_two) = interval_two

        return start_two <= end_one and end_two >= start_one

    def merge(self, intervals):
        non_overlapping_intervals = [intervals[0]]
        for i in range(1, len(intervals)):
            if self.doesOverlap(non_overlapping_intervals[-1], intervals[i]):
                non_overlapping_intervals[-1][0] = min(intervals[i][0], non_overlapping_intervals[-1][0])
                non_overlapping_intervals[-1][1] = max(intervals[i][1], non_overlapping_intervals[-1][1])
            else:
                non_overlapping_intervals.append(intervals[i])
        return non_overlapping_intervals

intervals = [[1,3],[2,6],[8,10],[15,18]]
s = Solution()
s.merge(intervals)
