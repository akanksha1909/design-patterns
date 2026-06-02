import unittest
from index import Router

class TestRoute(unittest.TestCase):

    def setUp(self):
        self.router = Router()
        self.router.addRoute("/foo", "fooHandler")
        self.router.addRoute("/bar/*/baz", "barHandler")

    def test_handler(self):
        self.assertEqual(self.router.callRoute("/foo"), "fooHandler")

    def test_wildcard(self):
        self.assertEqual(self.router.callRoute("/bar/*/baz"), "barHandler")

    def test_missing_segment_should_fail(self):
        self.assertIsNone(self.router.callRoute("/fooz"))

    def test_wildcard_does_not_match_extra_segments(self):
        self.assertIsNone(self.router.callRoute("/bar/hello/okay/baz"))

    def test_multiple_calls(self):
        # Ensure state does not corrupt across multiple calls
        self.assertEqual(self.router.callRoute("/foo"), "fooHandler")
        self.assertEqual(self.router.callRoute("/bar/*/baz"), "barHandler")
        self.assertIsNone(self.router.callRoute("/fooz"))


if __name__ == '__main__':
    unittest.main()