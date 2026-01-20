class DocumentEditor {
    constructor() {
        this.cursorPosition = 0;
        this.content = '';
        this.apiBase = '/api/document';
        
        this.initializeElements();
        this.loadDocument();
        this.setupEventListeners();
        this.setupKeyboardHandlers();
    }

    initializeElements() {
        this.editor = document.getElementById('editor');
        this.cursor = document.getElementById('cursor');
        this.appendBtn = document.getElementById('appendBtn');
        this.replaceBtn = document.getElementById('replaceBtn');
        this.textInput = document.getElementById('textInput');
        this.replaceLength = document.getElementById('replaceLength');
        this.cursorInfo = document.getElementById('cursorInfo');
        this.charCount = document.getElementById('charCount');
        this.lineCount = document.getElementById('lineCount');
    }

    async loadDocument() {
        try {
            const response = await fetch(this.apiBase);
            const data = await response.json();
            this.content = data.content || '';
            this.cursorPosition = data.cursorPosition || 0;
            this.updateEditor();
            this.updateCursor();
            this.updateStatus();
        } catch (error) {
            console.error('Error loading document:', error);
        }
    }

    async appendText(text) {
        if (!text) return;
        
        try {
            const response = await fetch(`${this.apiBase}/append`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            this.content = data.content;
            this.cursorPosition = data.cursorPosition;
            this.updateEditor();
            this.updateCursor();
            this.updateStatus();
        } catch (error) {
            console.error('Error appending text:', error);
        }
    }

    async replaceText(text, length) {
        try {
            const response = await fetch(`${this.apiBase}/replace`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, length })
            });
            const data = await response.json();
            this.content = data.content;
            this.cursorPosition = data.cursorPosition;
            this.updateEditor();
            this.updateCursor();
            this.updateStatus();
        } catch (error) {
            console.error('Error replacing text:', error);
        }
    }

    async moveCursor(direction) {
        try {
            const response = await fetch(`${this.apiBase}/cursor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direction })
            });
            const data = await response.json();
            this.cursorPosition = data.cursorPosition;
            this.updateCursor();
            this.updateStatus();
        } catch (error) {
            console.error('Error moving cursor:', error);
        }
    }

    async setCursorPosition(position) {
        try {
            const response = await fetch(`${this.apiBase}/cursor/set`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position })
            });
            const data = await response.json();
            this.cursorPosition = data.cursorPosition;
            this.updateCursor();
            this.updateStatus();
        } catch (error) {
            console.error('Error setting cursor position:', error);
        }
    }

    updateEditor() {
        // Update editor content
        this.editor.textContent = this.content;
        
        // Set cursor position after updating content
        setTimeout(() => {
            this.setCursorInEditor();
            this.updateCursorSimple();
        }, 10);
    }
    
    setCursorInEditor() {
        const selection = window.getSelection();
        const range = document.createRange();
        
        // Find text node and offset for cursor position
        const walker = document.createTreeWalker(
            this.editor,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let charCount = 0;
        let textNode = null;
        let offset = 0;
        
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const nodeLength = node.textContent.length;
            if (charCount + nodeLength >= this.cursorPosition) {
                textNode = node;
                offset = this.cursorPosition - charCount;
                break;
            }
            charCount += nodeLength;
        }
        
        if (textNode) {
            range.setStart(textNode, Math.min(offset, textNode.textContent.length));
            range.setEnd(textNode, Math.min(offset, textNode.textContent.length));
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateCursor() {
        // Create a temporary span to measure text position
        const textBeforeCursor = this.content.substring(0, this.cursorPosition);
        const textNode = document.createTextNode(textBeforeCursor);
        
        // Create a temporary container to measure
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'pre-wrap';
        tempSpan.style.fontSize = window.getComputedStyle(this.editor).fontSize;
        tempSpan.style.fontFamily = window.getComputedStyle(this.editor).fontFamily;
        tempSpan.style.lineHeight = window.getComputedStyle(this.editor).lineHeight;
        tempSpan.style.padding = window.getComputedStyle(this.editor).padding;
        tempSpan.style.width = window.getComputedStyle(this.editor).width;
        tempSpan.appendChild(textNode);
        
        document.body.appendChild(tempSpan);
        
        // Get the position
        const range = document.createRange();
        range.selectNodeContents(tempSpan);
        range.setStart(tempSpan, 0);
        range.setEnd(tempSpan, textNode.length);
        
        const rect = range.getBoundingClientRect();
        const editorRect = this.editor.getBoundingClientRect();
        
        // Calculate cursor position
        const lines = textBeforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];
        const lineHeight = parseInt(window.getComputedStyle(this.editor).lineHeight);
        
        // More accurate calculation
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = window.getComputedStyle(this.editor).cssText;
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.width = editorRect.width + 'px';
        tempDiv.textContent = textBeforeCursor;
        document.body.appendChild(tempDiv);
        
        const tempRect = tempDiv.getBoundingClientRect();
        const scrollTop = this.editor.scrollTop;
        const scrollLeft = this.editor.scrollLeft;
        
        // Calculate position relative to editor
        const x = tempRect.width - (tempRect.width % (editorRect.width || 1));
        const y = (lines.length - 1) * lineHeight;
        
        // Get the actual position using a more reliable method
        const selection = window.getSelection();
        const range2 = document.createRange();
        
        // Set cursor position in editor
        this.editor.focus();
        const walker = document.createTreeWalker(
            this.editor,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let charCount = 0;
        let textNode2 = null;
        let offset = 0;
        
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const nodeLength = node.textContent.length;
            if (charCount + nodeLength >= this.cursorPosition) {
                textNode2 = node;
                offset = this.cursorPosition - charCount;
                break;
            }
            charCount += nodeLength;
        }
        
        if (textNode2) {
            range2.setStart(textNode2, offset);
            range2.setEnd(textNode2, offset);
            selection.removeAllRanges();
            selection.addRange(range2);
            
            const cursorRect = range2.getBoundingClientRect();
            const editorRect2 = this.editor.getBoundingClientRect();
            
            this.cursor.style.left = (cursorRect.left - editorRect2.left + scrollLeft) + 'px';
            this.cursor.style.top = (cursorRect.top - editorRect2.top + scrollTop) + 'px';
        } else {
            // Fallback: calculate from text
            const lines2 = textBeforeCursor.split('\n');
            const lastLine = lines2[lines2.length - 1];
            const lineHeight2 = parseInt(window.getComputedStyle(this.editor).lineHeight) || 20;
            
            // Create a canvas to measure text width
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = window.getComputedStyle(this.editor).font;
            const textWidth = context.measureText(lastLine).width;
            
            const padding = parseInt(window.getComputedStyle(this.editor).paddingLeft) || 0;
            const lineNum = lines2.length - 1;
            
            this.cursor.style.left = (padding + textWidth) + 'px';
            this.cursor.style.top = (padding + lineNum * lineHeight2) + 'px';
        }
        
        document.body.removeChild(tempSpan);
        if (tempDiv.parentNode) {
            document.body.removeChild(tempDiv);
        }
    }

    // Simplified cursor update using text measurement
    updateCursorSimple() {
        const textBeforeCursor = this.content.substring(0, this.cursorPosition);
        const lines = textBeforeCursor.split('\n');
        const currentLineIndex = lines.length - 1;
        const currentLine = lines[currentLineIndex] || '';
        
        // Measure text width
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const editorStyle = window.getComputedStyle(this.editor);
        context.font = `${editorStyle.fontSize} ${editorStyle.fontFamily}`;
        const textWidth = context.measureText(currentLine).width;
        
        // Calculate position
        const lineHeight = parseInt(editorStyle.lineHeight) || 20;
        const padding = parseInt(editorStyle.padding) || 16;
        
        this.cursor.style.left = (padding + textWidth) + 'px';
        this.cursor.style.top = (padding + currentLineIndex * lineHeight) + 'px';
        this.cursor.style.height = lineHeight + 'px';
    }

    updateStatus() {
        this.cursorInfo.textContent = `Cursor: ${this.cursorPosition}`;
        this.charCount.textContent = `Characters: ${this.content.length}`;
        this.lineCount.textContent = `Lines: ${this.content.split('\n').length}`;
    }

    setupEventListeners() {
        this.appendBtn.addEventListener('click', () => {
            const text = this.textInput.value;
            if (text) {
                this.appendText(text);
                this.textInput.value = '';
            }
        });

        this.replaceBtn.addEventListener('click', () => {
            const text = this.textInput.value;
            const length = parseInt(this.replaceLength.value) || 0;
            if (text !== '') {
                this.replaceText(text, length);
                this.textInput.value = '';
            }
        });

        // Allow Enter key to append text
        this.textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const text = this.textInput.value;
                if (text) {
                    this.appendText(text);
                    this.textInput.value = '';
                }
            }
        });

        // Handle typing in editor
        this.editor.addEventListener('input', async (e) => {
            const newContent = this.editor.textContent;
            const selection = window.getSelection();
            
            if (selection.rangeCount === 0) return;
            
            const range = selection.getRangeAt(0);
            
            // Calculate cursor position
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(this.editor);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            const cursorPos = preCaretRange.toString().length;
            
            // Determine if text was added or removed
            if (newContent.length > this.content.length) {
                // Text was added - find what was added
                const oldPos = this.cursorPosition;
                const addedText = newContent.substring(oldPos, cursorPos);
                if (addedText) {
                    await this.appendText(addedText);
                }
            } else if (newContent.length < this.content.length) {
                // Text was removed (backspace/delete)
                // Sync with backend by setting cursor and content
                this.content = newContent;
                this.cursorPosition = cursorPos;
                await this.setCursorPosition(cursorPos);
                this.updateStatus();
            } else {
                // Content might have changed (e.g., paste)
                this.content = newContent;
                this.cursorPosition = cursorPos;
                await this.setCursorPosition(cursorPos);
                this.updateStatus();
            }
            
            setTimeout(() => this.updateCursorSimple(), 10);
        });

        // Handle clicks in editor to set cursor position
        this.editor.addEventListener('click', async (e) => {
            setTimeout(async () => {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(this.editor);
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    const cursorPos = preCaretRange.toString().length;
                    await this.setCursorPosition(cursorPos);
                    this.updateCursorSimple();
                }
            }, 10);
        });

        // Update cursor on selection change
        document.addEventListener('selectionchange', () => {
            if (document.activeElement === this.editor) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(this.editor);
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    const cursorPos = preCaretRange.toString().length;
                    this.cursorPosition = cursorPos;
                    this.updateStatus();
                    this.updateCursorSimple();
                }
            }
        });
    }

    setupKeyboardHandlers() {
        this.editor.addEventListener('keydown', async (e) => {
            // Handle arrow keys
            if (e.key === 'ArrowLeft' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                await this.moveCursor('left');
                this.updateCursorSimple();
            } else if (e.key === 'ArrowRight' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                await this.moveCursor('right');
                this.updateCursorSimple();
            } else if (e.key === 'ArrowUp' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                await this.moveCursor('up');
                this.updateCursorSimple();
            } else if (e.key === 'ArrowDown' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                await this.moveCursor('down');
                this.updateCursorSimple();
            } else if (e.key === 'PageUp') {
                e.preventDefault();
                await this.moveCursor('pageUp');
                this.updateCursorSimple();
            } else if (e.key === 'PageDown') {
                e.preventDefault();
                await this.moveCursor('pageDown');
                this.updateCursorSimple();
            }
        });

        // Update cursor position after keyboard input
        this.editor.addEventListener('keyup', () => {
            setTimeout(() => {
                this.updateCursorSimple();
            }, 10);
        });
    }
}

// Initialize editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DocumentEditor();
});

