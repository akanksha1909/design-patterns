class TrieNode:
    def __init__(self):
        self.children = {}
        self.handler = None
        self.wildcard = None

class Router:
    def __init__(self):
        self.root = TrieNode()

    # router.addRoute("/bar/*/baz", "bar")
    def addRoute(self, path, result):
        splitted_paths = [p for p in path.split("/") if p]

        node = self.root
        for path in splitted_paths:
            if path == "*":
                if node.wildcard:
                    node = node.wildcard
                else:
                    newNode = TrieNode()
                    node.wildcard = newNode
                    node = node.wildcard     
            elif path not in node.children:
                newNode = TrieNode()
                node.children[path] = newNode
                node = node.children[path]
            else:
                node = node.children[path]
        
        node.handler = result
                

    def callRoute(self, path):
        splitted_paths = [p for p in path.split("/") if p]
        node = self.root
        for path in splitted_paths:
            if node.wildcard is not None:
                node = node.wildcard
            elif path not in node.children:
                return None
            else:
                node = node.children[path]

        return node.handler


router = Router()
# router.addRoute("/foo", "foo")
# router.addRoute("/bar/*/baz", "bar")
# router.addRoute("/bar/*/baz1/*/baz2", "bar1")
# print(router.callRoute("/foo"))
# print(router.callRoute("/bar/foo/bazzz"))
# print(router.callRoute("/bar/anything/baz1/anything/baz2"))

# print(router.callRoute(""))

router.addRoute("/bar/*/baz1", "bar1")
router.addRoute("/bar/test/baz11", "bar2")
print(router.callRoute("/bar/test/baz11"))