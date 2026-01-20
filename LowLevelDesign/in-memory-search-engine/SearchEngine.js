/**
 * In-Memory Search Engine
 * Supports creating datasets, inserting/deleting documents, and searching with relevance ordering
 */
class SearchEngine {
  constructor() {
    // Map of datasetId -> Map of documentId -> document text
    this.datasets = new Map();
  }

  /**
   * Create a new dataset
   * @param {string} datasetId - Unique identifier for the dataset
   * @returns {boolean} - true if created, false if already exists
   */
  createDataset(datasetId) {
    if (this.datasets.has(datasetId)) {
      return false;
    }
    this.datasets.set(datasetId, new Map());
    return true;
  }

  /**
   * Insert a document into a dataset
   * @param {string} datasetId - The dataset identifier
   * @param {string} documentId - Unique identifier for the document
   * @param {string} text - The document text content
   * @returns {boolean} - true if inserted, false if dataset doesn't exist
   */
  insertDocument(datasetId, documentId, text) {
    if (!this.datasets.has(datasetId)) {
      return false;
    }
    const documents = this.datasets.get(datasetId);
    documents.set(documentId, text);
    return true;
  }

  /**
   * Delete a document from a dataset
   * @param {string} datasetId - The dataset identifier
   * @param {string} documentId - The document identifier to delete
   * @returns {boolean} - true if deleted, false if not found
   */
  deleteDocument(datasetId, documentId) {
    if (!this.datasets.has(datasetId)) {
      return false;
    }
    const documents = this.datasets.get(datasetId);
    return documents.delete(documentId);
  }

  /**
   * Count occurrences of a search term in text (case-insensitive)
   * @param {string} text - The text to search in
   * @param {string} searchTerm - The term to search for
   * @returns {number} - Number of occurrences
   */
  countOccurrences(text, searchTerm) {
    const lowerText = text.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    let count = 0;
    let index = 0;
    
    // Find all occurrences (including partial matches like "apple" in "apple-pie")
    while ((index = lowerText.indexOf(lowerTerm, index)) !== -1) {
      count++;
      index += 1; // Move forward to find next occurrence
    }
    
    return count;
  }

  /**
   * Search for documents containing the search pattern
   * Results are ordered by relevance (frequency of search term)
   * @param {string} datasetId - The dataset identifier
   * @param {string} searchPattern - The search term/pattern
   * @returns {Array} - Array of document IDs ordered by relevance (highest frequency first)
   */
  search(datasetId, searchPattern) {
    if (!this.datasets.has(datasetId)) {
      return [];
    }

    const documents = this.datasets.get(datasetId);
    const results = [];

    // Calculate relevance for each document
    for (const [documentId, text] of documents.entries()) {
      const count = this.countOccurrences(text, searchPattern);
      if (count > 0) {
        results.push({
          documentId,
          count,
          text
        });
      }
    }

    // Sort by count (descending), then by documentId for consistent ordering
    results.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // Higher count first
      }
      return a.documentId.localeCompare(b.documentId); // Alphabetical tie-breaker
    });

    // Return just the document IDs
    return results.map(result => result.documentId);
  }

  /**
   * Get all datasets
   * @returns {Array} - Array of dataset IDs
   */
  getDatasets() {
    return Array.from(this.datasets.keys());
  }

  /**
   * Get all documents in a dataset
   * @param {string} datasetId - The dataset identifier
   * @returns {Object} - Object mapping documentId to text, or null if dataset doesn't exist
   */
  getDocuments(datasetId) {
    if (!this.datasets.has(datasetId)) {
      return null;
    }
    const documents = this.datasets.get(datasetId);
    const result = {};
    for (const [documentId, text] of documents.entries()) {
      result[documentId] = text;
    }
    return result;
  }
}

module.exports = SearchEngine;


