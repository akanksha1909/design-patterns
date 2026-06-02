class TrieNode:
    def __init__(self):
        self.children = {} # foo: TrieNode
        self.handler = None
        self.wildcard = None


class Router:
    def __init__(self):
        self.root = TrieNode()

    def addRoute(self, path, handler):
        parts = [p for p in path.split("/") if p]
        node = self.root

        for sp in parts:
            if sp == "*":
                if not node.wildcard:
                    node.wildcard = TrieNode()
                node = node.wildcard
            else:
                if sp not in node.children:
                    node.children[sp] = TrieNode()
                node = node.children[sp]
        node.handler = handler


    def callRoute(self, path):
        node = self.root
        parts = [p for p in path.split("/") if p]
        for sp in parts:
            if sp in node.children:
                node = node.children[sp]
            elif node.wildcard:
                node = node.wildcard
            else:
                return None
        return node.handler
    
    def printTree(self):
        node = self.root
        print("Print tree", node.children.get('foo').handler)

# router = Router()

# router.addRoute("/foo", "fooHandler")
# # print(router.printTree())
# router.addRoute("/bar/*/baz", "barHandler")

# print(router.callRoute("/foo"));          # "fooHandler"
# print(router.callRoute("/bar/a/baz"));    # "barHandler"
# print(router.callRoute("/bar/x/baz"));    # "barHandler"
# print(router.callRoute("/bar/baz"));      # null (missing one segment)