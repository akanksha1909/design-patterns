# Google Docs Clone

A simplified Google Docs-like text editor built with Node.js and Express, featuring text editing operations and keyboard navigation.

## Features

- **Append Text**: Add text at the current cursor position
- **Replace Text**: Replace text starting from the cursor position
- **Arrow Key Navigation**: 
  - Left/Right arrows to move cursor horizontally
  - Up/Down arrows to move cursor vertically between lines
- **Page Up/Down**: Navigate up or down by 10 lines at a time
- **Real-time Cursor Tracking**: Visual cursor indicator with position tracking
- **Status Bar**: Shows cursor position, character count, and line count

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

### GET `/api/document`
Get the current document state (content, cursor position, line count)

### POST `/api/document/append`
Append text at the current cursor position
```json
{
  "text": "text to append"
}
```

### POST `/api/document/replace`
Replace text starting from cursor position
```json
{
  "text": "replacement text",
  "length": 5
}
```

### POST `/api/document/cursor`
Move cursor in a direction
```json
{
  "direction": "left" | "right" | "up" | "down" | "pageUp" | "pageDown"
}
```

### POST `/api/document/cursor/set`
Set cursor to a specific position
```json
{
  "position": 10
}
```

## Usage

1. **Appending Text**: 
   - Type text in the input field
   - Click "Append Text" button or press Enter
   - Text will be inserted at the current cursor position

2. **Replacing Text**:
   - Type replacement text in the input field
   - Enter the number of characters to replace
   - Click "Replace Text" button

3. **Navigation**:
   - Use arrow keys (↑ ↓ ← →) to move the cursor
   - Use Page Up/Page Down to jump 10 lines
   - Click anywhere in the editor to set cursor position

## Project Structure

```
google-docs/
├── server.js          # Express server and API endpoints
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── public/            # Frontend files
    ├── index.html     # Main HTML file
    ├── styles.css     # Styling
    └── editor.js      # Editor logic and API integration
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: RESTful API with client-server separation

