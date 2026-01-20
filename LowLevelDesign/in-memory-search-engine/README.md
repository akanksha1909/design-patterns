# In-Memory Search Engine

An in-memory search engine for tech blog content, built with Node.js and Express.

## Features

- Create datasets to organize documents
- Insert and delete documents in datasets
- Search documents by pattern/term
- Results ordered by relevance (term frequency)

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## API Endpoints

### Create Dataset
```
POST /datasets
Content-Type: application/json

{
  "datasetId": "blog-posts"
}
```

### Get All Datasets
```
GET /datasets
```

### Insert Document
```
POST /datasets/:datasetId/documents
Content-Type: application/json

{
  "documentId": "doc1",
  "text": "apple is a fruit"
}
```

### Delete Document
```
DELETE /datasets/:datasetId/documents/:documentId
```

### Get All Documents in Dataset
```
GET /datasets/:datasetId/documents
```

### Search Documents
```
GET /datasets/:datasetId/search?q=apple
```

Returns documents containing the search term, ordered by relevance (frequency of the term).

## Example Usage

1. Create a dataset:
```bash
curl -X POST http://localhost:3000/datasets \
  -H "Content-Type: application/json" \
  -d '{"datasetId": "blog"}'
```

2. Insert documents:
```bash
curl -X POST http://localhost:3000/datasets/blog/documents \
  -H "Content-Type: application/json" \
  -d '{"documentId": "doc1", "text": "apple is a fruit"}'

curl -X POST http://localhost:3000/datasets/blog/documents \
  -H "Content-Type: application/json" \
  -d '{"documentId": "doc2", "text": "apple, apple come on!"}'

curl -X POST http://localhost:3000/datasets/blog/documents \
  -H "Content-Type: application/json" \
  -d '{"documentId": "doc3", "text": "oranges are sour"}'

curl -X POST http://localhost:3000/datasets/blog/documents \
  -H "Content-Type: application/json" \
  -d '{"documentId": "doc4", "text": "apple-pie is sweet"}'
```

3. Search for "apple":
```bash
curl http://localhost:3000/datasets/blog/search?q=apple
```

Expected result: `["doc2", "doc1", "doc4"]` (ordered by frequency - doc2 has 2 occurrences, doc1 and doc4 have 1 each)

## How It Works

- Documents are stored in-memory using JavaScript Maps
- Search is case-insensitive
- Results are ordered by the frequency of the search term in each document
- Partial matches are supported (e.g., "apple" matches in "apple-pie")


