import heapq

class Solution:
    def minMeetingRooms(self, intervals):
        intervals.sort()
        meeting_rooms = []
        number_of_meeting_rooms = 0

        for interval in intervals:
            if meeting_rooms and meeting_rooms[0] <= interval[0]:
                heapq.heappop(meeting_rooms)
                heapq.heappush(meeting_rooms, interval[1])
            else:
                heapq.heappush(meeting_rooms, interval[1])
            number_of_meeting_rooms = max(number_of_meeting_rooms, len(meeting_rooms))
        return number_of_meeting_rooms
    
s = Solution()
intervals = [[7,10],[2,4]]
print(s.minMeetingRooms(intervals))


        