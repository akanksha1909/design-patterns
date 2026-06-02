import heapq

class File:
    def __init__(self, name, size, collection):
        self.name = name
        self.size = size
        self.collection = collection

class FileStorage:
    def __init__(self):
        self.collections = []
        self.totalSize = 0
        self.collectionObj = {} # collection: fileSize

    def getTotalSize(self):
        return self.totalSize

    def addFile(self, file):
        name = file.name
        size = file.size
        collectionName = file.collection
        self.totalSize += size
        self.collectionObj[collectionName] = self.collectionObj.get(collectionName, 0) + size
        heapq.heappush(self.collections, (-self.collectionObj[collectionName], collectionName, name))

    def topN(self, n):
        count = 0
        result = []
        while self.collections and count < n:
            (size, collectionName, fileName) = heapq.heappop(self.collections)
            print(size, collectionName, fileName)
            if (self.collectionObj[collectionName]) == -size:
                result.append(collectionName)
                count += 1
        return result

        
f = FileStorage()
file1 = File("file1", 100, "collection1")
file2 = File("file2", 200, "collection1")
file3 = File("file3", 200, "collection1")
file4 = File("file4", 300, "collection2")
file5 = File("file5", 10, "collection2")
f.addFile(file1)
f.addFile(file2)
f.addFile(file3)
f.addFile(file4)
f.addFile(file5)
print(f.topN(2))
# print(f.topN(2))
