import heapq

class BookingRecord:
    def __init__(self, id, start_time, end_time):
        self.id = id
        self.start_time = start_time
        self.end_time = end_time

class CourtAssignment:
    def __init__(self, court_id, booking):
        self.court_id = court_id
        self.booking = booking

def assign_courts(bookings):
    bookings.sort(key=lambda b: b.start_time)
    court_availability_heap = []

    next_court_id = 1
    assignments = []
    for booking in bookings:
        start_time = booking.start_time
        end_time = booking.end_time

        if not court_availability_heap:
            # Case 1: No courts exist yet. Create a new one.
            court_id = next_court_id
            next_court_id += 1
            heapq.heappush(court_availability_heap, (end_time, court_id))
        else:
            earliest_available_time, court_id = court_availability_heap[0]
            if start_time >= earliest_available_time:
                # Case 2: An existing court is available in time. Use it.
                heapq.heappop(court_availability_heap)

                # Update the court's availability time
                heapq.heappush(court_availability_heap, (end_time, court_id))
            else:
                # Case 3: No existing court is available in time. Create a new one.
                court_id = next_court_id
                next_court_id += 1
                
                # The new court is available right after this booking finishes
                heapq.heappush(court_availability_heap, (end_time, court_id))

        assignments.append(CourtAssignment(court_id, booking))
        
    return assignments
        
def assign_court_with_maintenance(bookings, maintenance_time):
    bookings.sort(key=lambda b: b.start_time)
    assignments = []
    court_availability_heap = []

    next_court_id = 1
    for booking in bookings:
        start_time = booking.start_time
        end_time = booking.end_time

        if not court_availability_heap:
            court_id = next_court_id
            next_court_id += 1
            heapq.heappush(court_availability_heap, (end_time + maintenance_time, court_id))
        else:
            earliest_available_time, court_id = court_availability_heap[0]
            if start_time >= earliest_available_time:
                heapq.heappop(court_availability_heap)
                heapq.heappush(court_availability_heap, (end_time + maintenance_time, court_id))
            else:
                court_id = next_court_id
                next_court_id += 1
                heapq.heappush(court_availability_heap, (end_time + maintenance_time, court_id))
        assignments.append(CourtAssignment(court_id, booking))
    return assignments

def assign_court_with_maintenance_durability(bookings, maintenance_time, durability):
    bookings.sort(key=lambda b: b.start_time)

    assignments = []
    court_availability_heap = []
    next_court_id = 1
    court_usage_count = {} # court_id -> usage_count

    for booking in bookings:
        start_time = booking.start_time
        end_time = booking.end_time


        if not court_availability_heap:
            court_id = next_court_id
            next_court_id += 1
            court_usage_count[court_id] = court_usage_count.get(court_id, 0) + 1
            if court_usage_count[court_id] == durability:
                heapq.heappush(court_availability_heap, (end_time + maintenance_time, court_id))
                court_usage_count[court_id] = 0
            else:
                heapq.heappush(court_availability_heap, (end_time, court_id))
        else:
            earliest_available_time, court_id = court_availability_heap[0]            
            if start_time >= earliest_available_time:
                heapq.heappop(court_availability_heap)
                court_usage_count[court_id] += 1

                if court_usage_count[court_id] == durability:
                    heapq.heappush(court_availability_heap, (end_time + maintenance_time, court_id))
                    court_usage_count[court_id] = 0
                else:
                    heapq.heappush(court_availability_heap, (end_time, court_id))
            else:
                court_id = next_court_id
                next_court_id += 1
                court_usage_count[court_id] = court_usage_count.get(court_id, 0) + 1
                if court_usage_count[court_id] == durability:
                    heapq.heappush(court_availability_heap, (end_time + maintenance_time, court_id))
                    court_usage_count[court_id] = 0
                else:
                    heapq.heappush(court_availability_heap, (end_time, court_id))

        assignments.append(CourtAssignment(court_id, booking))
    return assignments

def get_minimum_courts(bookings):
    bookings.sort(key=lambda b: b.start_time)
    max_concurrent_courts = 0
    court_finish_times = []

    for booking in bookings:
        start_time = booking.start_time
        end_time = booking.end_time

        if court_finish_times and start_time >= court_finish_times[0]:
            heapq.heappop(court_finish_times)
        
        heapq.heappush(court_finish_times, end_time)
        max_concurrent_courts = max(max_concurrent_courts, len(court_finish_times))

    return max_concurrent_courts

def check_conflict(booking_one, booking_two):
    s1, e1 = booking_one.start_time, booking_one.end_time
    s2, e2 = booking_two.start_time, booking_two.end_time

    if s2 < e1 and e2 > s1:
        return True
    return False

# Part A
bookings = [
    BookingRecord(1, 10, 20),
    BookingRecord(2, 12, 18),
    BookingRecord(3, 20, 30),
    BookingRecord(4, 25, 35),
    BookingRecord(5, 30, 40),
]

# 1 -> 1 (20)
# 2 -> 2 (18)
# 3 -> 2 (30)
# 4 -> 1 (35)
# 5 -> 2 (40)
print("--- Part A: Minimum Courts (No Maintenance) ---")
courts = assign_courts(bookings)
for court in courts:
    print(court.booking.id, court.court_id, court.booking.start_time, court.booking.end_time)

# ---------- Part B ----------
# 1 -> 1
# 2 -> 2
# 3 -> 3
# 4 -> 2
# 5 -> 1
maintenance_time = 5
print(f"--- Part B: Fixed Maintenance Time (X={maintenance_time}) After Every Use ---")
courts_with_maintenance_time = assign_court_with_maintenance(bookings, maintenance_time)
for court in courts_with_maintenance_time:
    print(court.booking.id, court.court_id, court.booking.start_time, court.booking.end_time)

# --- Part C: Complex Maintenance Rules (X Usage and Y Time) ---

maintenance_time = 10
usage = 1
print(f"--- Part C: Complex Maintenance (Y={maintenance_time} after X={usage} bookings) ---")
court_with_maintenance_durability = assign_court_with_maintenance_durability(bookings, maintenance_time, usage)
for court in court_with_maintenance_durability:
    print(court.booking.id, court.court_id, court.booking.start_time, court.booking.end_time)

# --- Part D: Minimum Courts Needed (Simplified Problem) ---
print(f"Part D: Minimum Courts Needed (Simplified Problem)")
number_of_courts = get_minimum_courts(bookings)
print(f"Minimum number of courts {number_of_courts}")

# ----- check_conflict---
print(f"Check conflicts")
print(check_conflict(BookingRecord(1, 10, 12), BookingRecord(2, 12, 18)))
