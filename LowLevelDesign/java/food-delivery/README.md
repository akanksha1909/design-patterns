1. Users Table
Users
------
id (PK)
name
email
phone
password_hash
created_at

User can have multiple addresses.

2. UserAddresses
UserAddresses
-------------
id (PK)
user_id (FK -> Users.id)
line1
line2
city
state
pincode
lat
lng
is_default

Needed for delivery.

3. Restaurants
Restaurants
-----------
id (PK)
name
owner_id
phone
address
city
lat
lng
rating
is_open
created_at
4. MenuCategories
MenuCategories
--------------
id (PK)
restaurant_id (FK)
name

Example:

Starters

Main Course

Drinks

5. MenuItems
MenuItems
---------
id (PK)
restaurant_id (FK)
category_id (FK)
name
description
price
is_veg
is_available
6. Orders
Orders
------
id (PK)
user_id (FK)
restaurant_id (FK)
address_id (FK)
status
total_amount
delivery_fee
tax
created_at

Status:

CREATED
CONFIRMED
PREPARING
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
7. OrderItems
OrderItems
----------
id (PK)
order_id (FK)
menu_item_id (FK)
quantity
price

Important: store price snapshot

8. DeliveryPartners
DeliveryPartners
----------------
id (PK)
name
phone
vehicle_number
lat
lng
is_available
rating
9. Deliveries
Deliveries
----------
id (PK)
order_id (FK)
partner_id (FK)
pickup_time
delivery_time
status
10. Payments
Payments
--------
id (PK)
order_id (FK)
amount
method
status
transaction_id
created_at

method:

UPI

CARD

COD

WALLET

11. Ratings
Ratings
-------
id (PK)
user_id (FK)
order_id (FK)
restaurant_rating
delivery_rating
comment
created_at
12. Offers / Coupons (optional but good for interview)
Coupons
-------
id
code
discount_percent
max_discount
min_order
expiry
OrderCoupons
------------
order_id
coupon_id
discount_amount
Relationships Diagram (mental model)
User ──< Orders >── Restaurant
   │         │
   │         └── OrderItems ── MenuItems
   │
   └── Addresses

Order ── Delivery ── DeliveryPartner

Order ── Payment

Order ── Rating