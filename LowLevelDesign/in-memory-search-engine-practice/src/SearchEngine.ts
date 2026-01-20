import Trie from "./Trie.js"

class SearchEngine {
    public datasets: Map<string, { documents: Map<string, { text: string, size: number, tokens: string[] }>, trie: Trie }>;
    constructor() {
        this.datasets = new Map();
    }

    createDataSet(datasetName) {
        if (this.datasets.has(datasetName)) {
            return;
        }
        this.datasets.set(datasetName, {
            documents: new Map(),
            trie: new Trie()
        })
    }

    insertDocument(datasetName, docName, text) {
        const tokens = this.tokenize(text)
        this.datasets.get(datasetName).documents.set(docName, { text, size: tokens.length, tokens })
        tokens.forEach(word => this.datasets.get(datasetName).trie.insert(word, docName))
    }

    deleteDocument(datasetName, docName) {
        const dataset = this.datasets.get(datasetName);
        if (!dataset) return;
        const document = dataset.documents.get(docName)
        if (!document) return;

        document.tokens.forEach(word => dataset.trie.delete(word, docName))
        dataset.documents.delete(docName)
    }

    tokenize(text) {
        return text.toLowerCase().split(" ").filter(Boolean)
    }

    searchInDataset(datasetName, query, strategy = "frequency") {
        const dataset = this.datasets.get(datasetName);
        const scores = dataset.trie.searchPrefix(query); // Map<docId, freq>
        const docs = scores.keys();
        const results = [];
        const answer = [];
        if (strategy == "freq") {
            for (const docId of docs) {
                results.push({ docId, score: scores.get(docId) })
            }
            results.sort((a, b) => b.score - a.score)


        } else { // sort by document size
            for (const docId of docs) {
                results.push({ docId, size: dataset.documents.get(docId).size })
            }
            results.sort((a, b) => b.size - a.size)
        }
        results.map(result => answer.push(result.docId))
        return answer
    }
}

const searchEngine = new SearchEngine()
export default searchEngine;
