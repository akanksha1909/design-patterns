class TrieNode {
    public children: Map<string, TrieNode>;
    public docs: Map<string, number>;
    constructor() {
        this.children = new Map(); // char -> TrieNode
        this.docs = new Map(); // docId: freq
    }
}

class Trie {
    private root: TrieNode;
    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string, docName: string) {
        let currentNode = this.root;
        for (const char of word) {
            if (!currentNode.children.has(char)) {
                let newNode = new TrieNode()
                currentNode.children.set(char, newNode)
            }
            currentNode = currentNode.children.get(char);
        };
        if (currentNode.docs.has(docName)) {
            currentNode.docs.set(docName, currentNode.docs.get(docName) + 1)
        } else {
            currentNode.docs.set(docName, 1)
        }
    }

    delete(word: string, docName: string) {
        let currentNode = this.root;
        let stack= [];
        for (const char of word) {
            if (!currentNode.children.has(char)) {
                return
            }
            stack.push([currentNode, char]);
            currentNode = currentNode.children.get(char)
        }
        if (currentNode.docs.has(docName)) {
            const freq = currentNode.docs.get(docName);
            if (freq > 1) {
                currentNode.docs.set(docName, freq - 1);
            } else {
                currentNode.docs.delete(docName);
            }
        }

        for(let i = stack.length -1; i >=0; i--) {
            const [parentNode, char] = stack[i];
            const childNode = parentNode.children.get(char);
            if (childNode.docs.size === 0 && childNode.children.size === 0) {
                parentNode.children.delete(char);
            } else {
                break;
            }
        }           
    }

    searchPrefix(prefix) {
        let currentNode = this.root;
        let results = new Map();
        for(const char of prefix) {
            if(!currentNode.children.has(char)) {
                return
            }
            currentNode = currentNode.children.get(char)
        }
        for(const [doc, freq] of currentNode.docs) {
            results.set(doc, freq);
        }
        return results;
    }
}

export default Trie;