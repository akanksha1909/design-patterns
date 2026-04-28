Perfect 👍 BookMyShow HLD is a classic.

This is primarily a seat inventory + booking consistency problem.

You’re designing tables for:

Movies
Theatres
Shows
Seats
Booking
Payments

Let’s design this properly (production-grade, senior-level).

🎬 1️⃣ movies
movies
-------
id (PK, bigint)
title (varchar)
language (varchar)
duration_minutes (int)
genre (varchar)
release_date (date)
censor_rating (varchar)
created_at (timestamp)
updated_at (timestamp)

Indexes:

idx_movies_release_date
idx_movies_language

🏢 2️⃣ theatres
theatres
---------
id (PK, bigint)
name (varchar)
city (varchar)
address (text)
timezone (varchar)
created_at
updated_at

Index:

idx_theatres_city

🎭 3️⃣ screens

A theatre can have multiple screens.

screens
--------
id (PK)
theatre_id (FK -> theatres.id)
name (varchar)           -- Screen 1
total_seats (int)
created_at

Index:

idx_screens_theatre_id

💺 4️⃣ seats (static seat layout)

Seats belong to a screen.

seats
------
id (PK)
screen_id (FK)
row_label (varchar)      -- A, B, C
seat_number (int)        -- 1,2,3
seat_type (varchar)      -- regular, recliner
created_at

Unique constraint:

(screen_id, row_label, seat_number)
🎥 5️⃣ shows

Each movie plays at a screen at a specific time.

shows
------
id (PK)
movie_id (FK)
screen_id (FK)
start_time (timestamp)
end_time (timestamp)
base_price (numeric)
status (scheduled/cancelled)
created_at

Index:

idx_shows_movie_id
idx_shows_start_time
idx_shows_screen_id

🔥 6️⃣ show_seats (CRITICAL TABLE)

This is the most important table.

Seats availability must be per show.

show_seats
------------
id (PK)
show_id (FK)
seat_id (FK)
price (numeric)
status (available/locked/booked)
locked_by (nullable user_id)
locked_at (timestamp nullable)
version (int)  -- for optimistic locking

Unique constraint:

(show_id, seat_id)

Index:

idx_show_seats_show_id
idx_show_seats_status

💡 This table handles concurrency.

🧾 7️⃣ bookings
bookings
----------
id (PK)
user_id
show_id (FK)
total_amount
status (initiated/confirmed/failed/cancelled)
created_at
updated_at

Index:

idx_bookings_user_id
idx_bookings_show_id

🎟 8️⃣ booking_seats

Mapping seats to booking.

booking_seats
---------------
id (PK)
booking_id (FK)
show_seat_id (FK)
price
created_at

Unique constraint:
(show_seat_id)

Prevents double booking.

💳 9️⃣ payments
payments
---------
id (PK)
booking_id (FK)
provider (razorpay/stripe/etc)
amount
status (pending/success/failed)
transaction_reference
created_at