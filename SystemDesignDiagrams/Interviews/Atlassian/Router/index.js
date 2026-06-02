class TrieNode {
    constructor() {
        this.children = new Map();
        this.wildcard = null;
        this.handler = null;
    }
}

class Router {
    constructor() {
        this.root = new TrieNode();
    }

    getRoot() {
        return this.root;
    }

    addRoute(path, handler) {
        const segments = this._split(path);
        let node = this.root;

        for (const segment of segments) {
            if (segment === "*") {
                if (!node.wildcard) {
                    node.wildcard = new TrieNode();
                }
                node = node.wildcard;
            } else {
                if (!node.children.has(segment)) {
                    node.children.set(segment, new TrieNode())
                }
                node = node.children.get(segment)
            }
        }
        node.handler = handler;
    }

    callRoute(path) {
        const segments = this._split(path);
        return this._search(segments, this.root, 0)
    }

    _split(path) {
        return path.split("/").filter(Boolean)
    }

    _search(segments, node, index) {
        if (index == segments.length) {
            return node.handler;
        }
        const segment = segments[index];
        if (node.children.has(segment)) {
            const res = this._search(segments, node.children.get(segment), index + 1)
            if (res != null) {
                return res;
            }
        }

        if (node.wildcard) {
            const res = this._search(segments, node.wildcard, index + 1)
            if (res != null) {
                return res;
            }
        }
        return null;
    }
}


const router = new Router();

router.addRoute("/foo", "fooHandler");
router.addRoute("/bar/*/baz", "barHandler");

console.log(router.callRoute("/foo"));          // "fooHandler"
console.log(router.callRoute("/bar/a/baz"));    // "barHandler"
console.log(router.callRoute("/bar/x/baz"));    // "barHandler"
console.log(router.callRoute("/bar/baz"));      // null (missing one segment)

