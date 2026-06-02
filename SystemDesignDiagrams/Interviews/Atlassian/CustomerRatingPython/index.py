class CustomerRating:
    def __init__(self):
        self.ratings = {} #customerId: [rating]

    def addRating(self, customerId, rating):
        if customerId not in self.ratings:
            self.ratings[customerId] = []
        
        self.ratings[customerId].append(rating)

    def getAvgRating(self, customerId):
        if customerId not in self.ratings: return 0

        ratings = sum(self.ratings[customerId])
        noOfRatings = len(self.ratings[customerId])
        return ratings/noOfRatings
    
customerRatingSystem = CustomerRating()
customerRatingSystem.addRating("Akanksha", 5)
customerRatingSystem.addRating("Anshuman", 4)
customerRatingSystem.addRating("Akanksha", 6)
customerRatingSystem.addRating("Akanksha", 4)

print(customerRatingSystem.getAvgRating("Anshuman"))