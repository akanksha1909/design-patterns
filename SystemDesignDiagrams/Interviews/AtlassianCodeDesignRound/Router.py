class Router:
    def __init__(self):
        self.routerMapping = {}

    def addRoute(self, path, result):
        self.routerMapping[path] = result

    def callRoute(self, path):
        if path not in self.routerMapping:
            return None
        return self.routerMapping[path]

router = Router()
router.addRoute("/bar", "result1")
router.addRoute("/bar", "result3")
router.addRoute("/bar/foo", "result2")
print(router.callRoute("/bar"))
print(router.callRoute("/bar/foo"))
print(router.callRoute(""))