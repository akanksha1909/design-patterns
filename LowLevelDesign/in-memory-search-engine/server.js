const express = require('express');
const SearchEngine = require('./SearchEngine');

const app = express();
const searchEngine = new SearchEngine();

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'In-Memory Search Engine API',
    endpoints: {
      'POST /datasets': 'Create a new dataset',
      'GET /datasets': 'Get all datasets',
      'POST /datasets/:datasetId/documents': 'Insert a document',
      'DELETE /datasets/:datasetId/documents/:documentId': 'Delete a document',
      'GET /datasets/:datasetId/documents': 'Get all documents in a dataset',
      'GET /datasets/:datasetId/search': 'Search documents (query param: q)'
    }
  });
});

/**
 * Create a new dataset
 * POST /datasets
 * Body: { datasetId: "string" }
 */
app.post('/datasets', (req, res) => {
  const { datasetId } = req.body;
  
  if (!datasetId || typeof datasetId !== 'string') {
    return res.status(400).json({ error: 'datasetId is required and must be a string' });
  }

  const created = searchEngine.createDataset(datasetId);
  
  if (created) {
    res.status(201).json({ message: `Dataset '${datasetId}' created successfully` });
  } else {
    res.status(409).json({ error: `Dataset '${datasetId}' already exists` });
  }
});

/**
 * Get all datasets
 * GET /datasets
 */
app.get('/datasets', (req, res) => {
  const datasets = searchEngine.getDatasets();
  res.json({ datasets });
});

/**
 * Insert a document into a dataset
 * POST /datasets/:datasetId/documents
 * Body: { documentId: "string", text: "string" }
 */
app.post('/datasets/:datasetId/documents', (req, res) => {
  const { datasetId } = req.params;
  const { documentId, text } = req.body;

  if (!documentId || typeof documentId !== 'string') {
    return res.status(400).json({ error: 'documentId is required and must be a string' });
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required and must be a string' });
  }

  const inserted = searchEngine.insertDocument(datasetId, documentId, text);

  if (inserted) {
    res.status(201).json({ 
      message: `Document '${documentId}' inserted into dataset '${datasetId}'`,
      documentId,
      text
    });
  } else {
    res.status(404).json({ error: `Dataset '${datasetId}' not found` });
  }
});

/**
 * Delete a document from a dataset
 * DELETE /datasets/:datasetId/documents/:documentId
 */
app.delete('/datasets/:datasetId/documents/:documentId', (req, res) => {
  const { datasetId, documentId } = req.params;

  const deleted = searchEngine.deleteDocument(datasetId, documentId);

  if (deleted) {
    res.json({ message: `Document '${documentId}' deleted from dataset '${datasetId}'` });
  } else {
    res.status(404).json({ 
      error: `Document '${documentId}' not found in dataset '${datasetId}'` 
    });
  }
});

/**
 * Get all documents in a dataset
 * GET /datasets/:datasetId/documents
 */
app.get('/datasets/:datasetId/documents', (req, res) => {
  const { datasetId } = req.params;

  const documents = searchEngine.getDocuments(datasetId);

  if (documents === null) {
    return res.status(404).json({ error: `Dataset '${datasetId}' not found` });
  }

  res.json({ datasetId, documents });
});

/**
 * Search documents in a dataset
 * GET /datasets/:datasetId/search?q=searchTerm
 */
app.get('/datasets/:datasetId/search', (req, res) => {
  const { datasetId } = req.params;
  const { q: searchPattern } = req.query;

  if (!searchPattern || typeof searchPattern !== 'string') {
    return res.status(400).json({ error: 'Search query parameter (q) is required' });
  }

  const results = searchEngine.search(datasetId, searchPattern);

  res.json({
    datasetId,
    searchPattern,
    results,
    count: results.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`In-Memory Search Engine server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});

module.exports = app;


