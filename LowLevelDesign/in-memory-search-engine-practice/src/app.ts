import express from 'express';
import searchEngine from "./SearchEngine.js";

const app = express()
app.use(express.json());

app.post("/datasets", (req, res) => {
    const { datasetName } = req.body;
    searchEngine.createDataSet(datasetName);
    res.json({ message: "Dataset created" });
});

app.post("/datasets/:datasetName/document", (req, res) => {
    const { docName, text } = req.body;
    searchEngine.insertDocument(req.params.datasetName, docName, text)
    res.json({ message: "Document inserted" });
});

app.delete("/datasets/:datasetName/document/:docName", (req, res) => {
    const { datasetName, docName } = req.params;
    searchEngine.deleteDocument(datasetName, docName);
    res.json({ message: "Document deleted" });
});

app.post("/datasets/:datasetName/search", (req, res) => {
    const { query } = req.body;
    let strategy = "size";
    const results = searchEngine.searchInDataset(req.params.datasetName, query, strategy);
    res.json({ results });
});


app.listen(3000, () => {
    console.log("server is running on port 3000")
});