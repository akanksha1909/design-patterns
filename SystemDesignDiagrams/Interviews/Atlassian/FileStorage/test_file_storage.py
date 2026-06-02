import unittest
from index import File, FileStorage

class TestFileStorage(unittest.TestCase):

    def setUp(self):
        self.fileStorage = FileStorage()

    def test_total_size(self):
        file = File("file1", 200, "collection1")
        self.fileStorage.addFile(file)
        self.assertEqual(self.fileStorage.totalSize, 200)

    def test_file_present_in_hash_map(self):
        file = File("file1", 200, "collection1")
        self.fileStorage.addFile(file)
        self.assertEqual(self.fileStorage.collectionObj[file.collection], 200)

    def test_top_n(self):
        file1 = File("file1", 200, "collection1")
        file2 = File("file2", 100, "collection2")
        file3 = File("file3", 300, "collection1")

        self.fileStorage.addFile(file1)
        self.fileStorage.addFile(file2)
        self.fileStorage.addFile(file3)

        results = self.fileStorage.topN(1)
        for result in results:
            self.assertEqual(result, "collection1")



if __name__ == '__main__':
    unittest.main()