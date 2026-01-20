const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Document state management
class Document {
  constructor() {
    this.content = '';
    this.cursorPosition = 0;
    this.lines = [''];
  }

  // Update lines array based on content
  updateLines() {
    this.lines = this.content.split('\n');
  }

  // Get current line and column from cursor position
  getCursorLineColumn() {
    let line = 0;
    let column = 0;
    let pos = 0;

    for (let i = 0; i < this.lines.length; i++) {
      const lineLength = this.lines[i].length;
      if (pos + lineLength >= this.cursorPosition) {
        line = i;
        column = this.cursorPosition - pos;
        break;
      }
      pos += lineLength + 1; // +1 for newline character
    }

    return { line, column };
  }

  // Get cursor position from line and column
  getCursorPositionFromLineColumn(line, column) {
    let pos = 0;
    for (let i = 0; i < line && i < this.lines.length; i++) {
      pos += this.lines[i].length + 1;
    }
    pos += Math.min(column, this.lines[line]?.length || 0);
    return pos;
  }

  // Append text at cursor position
  append(text) {
    const before = this.content.substring(0, this.cursorPosition);
    const after = this.content.substring(this.cursorPosition);
    this.content = before + text + after;
    this.cursorPosition += text.length;
    this.updateLines();
    return { content: this.content, cursorPosition: this.cursorPosition };
  }

  // Replace text at cursor position
  replace(text, length = 0) {
    const before = this.content.substring(0, this.cursorPosition);
    const after = this.content.substring(this.cursorPosition + length);
    this.content = before + text + after;
    this.cursorPosition += text.length;
    this.updateLines();
    return { content: this.content, cursorPosition: this.cursorPosition };
  }

  // Move cursor left
  moveLeft() {
    if (this.cursorPosition > 0) {
      this.cursorPosition--;
    }
    return { cursorPosition: this.cursorPosition };
  }

  // Move cursor right
  moveRight() {
    if (this.cursorPosition < this.content.length) {
      this.cursorPosition++;
    }
    return { cursorPosition: this.cursorPosition };
  }

  // Move cursor up
  moveUp() {
    const { line, column } = this.getCursorLineColumn();
    if (line > 0) {
      const newLine = line - 1;
      const newColumn = Math.min(column, this.lines[newLine].length);
      this.cursorPosition = this.getCursorPositionFromLineColumn(newLine, newColumn);
    }
    return { cursorPosition: this.cursorPosition };
  }

  // Move cursor down
  moveDown() {
    const { line, column } = this.getCursorLineColumn();
    if (line < this.lines.length - 1) {
      const newLine = line + 1;
      const newColumn = Math.min(column, this.lines[newLine].length);
      this.cursorPosition = this.getCursorPositionFromLineColumn(newLine, newColumn);
    }
    return { cursorPosition: this.cursorPosition };
  }

  // Page up (move up by 10 lines)
  pageUp() {
    const { line, column } = this.getCursorLineColumn();
    const newLine = Math.max(0, line - 10);
    const newColumn = Math.min(column, this.lines[newLine]?.length || 0);
    this.cursorPosition = this.getCursorPositionFromLineColumn(newLine, newColumn);
    return { cursorPosition: this.cursorPosition };
  }

  // Page down (move down by 10 lines)
  pageDown() {
    const { line, column } = this.getCursorLineColumn();
    const newLine = Math.min(this.lines.length - 1, line + 10);
    const newColumn = Math.min(column, this.lines[newLine]?.length || 0);
    this.cursorPosition = this.getCursorPositionFromLineColumn(newLine, newColumn);
    return { cursorPosition: this.cursorPosition };
  }

  // Get document state
  getState() {
    return {
      content: this.content,
      cursorPosition: this.cursorPosition,
      lines: this.lines.length
    };
  }
}

// Global document instance
const document = new Document();

// API Routes

// Get document state
app.get('/api/document', (req, res) => {
  res.json(document.getState());
});

// Append text
app.post('/api/document/append', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text must be a string' });
  }
  const result = document.append(text);
  res.json(result);
});

// Replace text
app.post('/api/document/replace', (req, res) => {
  const { text, length } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Text must be a string' });
  }
  const replaceLength = typeof length === 'number' ? length : 0;
  const result = document.replace(text, replaceLength);
  res.json(result);
});

// Move cursor
app.post('/api/document/cursor', (req, res) => {
  const { direction } = req.body;
  
  let result;
  switch (direction) {
    case 'left':
      result = document.moveLeft();
      break;
    case 'right':
      result = document.moveRight();
      break;
    case 'up':
      result = document.moveUp();
      break;
    case 'down':
      result = document.moveDown();
      break;
    case 'pageUp':
      result = document.pageUp();
      break;
    case 'pageDown':
      result = document.pageDown();
      break;
    default:
      return res.status(400).json({ error: 'Invalid direction' });
  }
  
  res.json(result);
});

// Set cursor position
app.post('/api/document/cursor/set', (req, res) => {
  const { position } = req.body;
  if (typeof position !== 'number' || position < 0 || position > document.content.length) {
    return res.status(400).json({ error: 'Invalid cursor position' });
  }
  document.cursorPosition = position;
  res.json({ cursorPosition: document.cursorPosition });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

