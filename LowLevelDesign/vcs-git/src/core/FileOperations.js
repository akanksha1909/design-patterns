/**
 * File operations for VCS
 */
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

class FileOperations {
  constructor(repoPath) {
    this.repoPath = path.resolve(repoPath);
    this.vcsDir = path.join(this.repoPath, '.vcs');
  }

  async findFilesByRegex(pattern) {
    const files = [];
    try {
      // Use find command with regex (more reliable than walking in Node.js)
      const { stdout } = await execAsync(
        `find "${this.repoPath}" -type f ! -path "*/.vcs/*" -regex "${pattern}" 2>/dev/null || true`,
        { cwd: this.repoPath }
      );
      
      const foundFiles = stdout.trim().split('\n').filter(f => f);
      
      for (const filePath of foundFiles) {
        const relativePath = path.relative(this.repoPath, filePath);
        if (relativePath && !relativePath.startsWith('..')) {
          files.push(relativePath);
        }
      }
    } catch (error) {
      // Fallback: walk directory manually
      files.push(...await this._walkDirectory(pattern));
    }
    
    return files.sort();
  }

  async _walkDirectory(pattern) {
    const files = [];
    let regex;
    
    try {
      regex = new RegExp(pattern);
    } catch (error) {
      // Invalid regex pattern
      return files;
    }
    
    async function walk(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(this.repoPath, fullPath);
        
        if (entry.isDirectory()) {
          if (entry.name !== '.vcs') {
            await walk(fullPath);
          }
        } else if (entry.isFile()) {
          if (regex.test(relativePath)) {
            files.push(relativePath);
          }
        }
      }
    }
    
    await walk.call(this, this.repoPath);
    return files;
  }

  async getFileContent(filePath) {
    const fullPath = path.join(this.repoPath, filePath);
    try {
      return await fs.readFile(fullPath);
    } catch {
      return null;
    }
  }

  async writeFileContent(filePath, content) {
    const fullPath = path.join(this.repoPath, filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  async deleteFile(filePath) {
    const fullPath = path.join(this.repoPath, filePath);
    try {
      await fs.unlink(fullPath);
      // Try to remove empty parent directories
      try {
        await fs.rmdir(path.dirname(fullPath));
      } catch {
        // Directory not empty or doesn't exist, ignore
      }
    } catch {
      // File doesn't exist, ignore
    }
  }

  async fileExists(filePath) {
    try {
      const stats = await fs.stat(path.join(this.repoPath, filePath));
      return stats.isFile();
    } catch {
      return false;
    }
  }

  async getAllTrackedFiles() {
    const files = new Set();
    
    async function walk(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(this.repoPath, fullPath);
        
        if (entry.isDirectory()) {
          if (entry.name !== '.vcs') {
            await walk(fullPath);
          }
        } else if (entry.isFile()) {
          files.add(relativePath);
        }
      }
    }
    
    await walk(this.repoPath);
    return Array.from(files);
  }

  async getFileHash(filePath) {
    const content = await this.getFileContent(filePath);
    if (content) {
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(content).digest('hex');
    }
    return null;
  }

  async getFileDiff(filePath, oldContent, newContent) {
    // Simple diff implementation - can be extended with a proper diff library
    if (!oldContent && newContent) {
      return `+${newContent.toString('utf-8')}`;
    }
    if (oldContent && !newContent) {
      return `-${oldContent.toString('utf-8')}`;
    }
    if (!oldContent && !newContent) {
      return '';
    }

    const oldLines = oldContent.toString('utf-8').split('\n');
    const newLines = newContent.toString('utf-8').split('\n');
    const diff = [];
    
    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      
      if (oldLine === undefined) {
        diff.push(`+${newLine}`);
      } else if (newLine === undefined) {
        diff.push(`-${oldLine}`);
      } else if (oldLine !== newLine) {
        diff.push(`-${oldLine}`);
        diff.push(`+${newLine}`);
      } else {
        diff.push(` ${oldLine}`);
      }
    }
    
    return diff.join('\n');
  }
}

module.exports = FileOperations;

