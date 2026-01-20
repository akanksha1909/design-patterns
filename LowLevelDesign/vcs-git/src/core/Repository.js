/**
 * Core repository management for VCS
 */
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class Commit {
  constructor(hash, message, parent, author, timestamp, treeHash) {
    this.hash = hash;
    this.message = message;
    this.parent = parent;
    this.author = author;
    this.timestamp = timestamp;
    this.treeHash = treeHash;
  }

  toJSON() {
    return {
      hash: this.hash,
      message: this.message,
      parent: this.parent,
      author: this.author,
      timestamp: this.timestamp.toISOString(),
      treeHash: this.treeHash
    };
  }

  static fromJSON(data) {
    return new Commit(
      data.hash,
      data.message,
      data.parent,
      data.author,
      new Date(data.timestamp),
      data.treeHash
    );
  }
}

class Repository {
  constructor(rootPath) {
    this.rootPath = path.resolve(rootPath);
    this.vcsPath = path.join(this.rootPath, '.vcs');
    this.objectsPath = path.join(this.vcsPath, 'objects');
    this.refsPath = path.join(this.vcsPath, 'refs');
    this.headsPath = path.join(this.refsPath, 'heads');
  }

  async isInitialized() {
    try {
      const stats = await fs.stat(this.vcsPath);
      const objectsStats = await fs.stat(this.objectsPath);
      return stats.isDirectory() && objectsStats.isDirectory();
    } catch {
      return false;
    }
  }

  async init() {
    if (await this.isInitialized()) {
      return false;
    }

    // Create directory structure
    await fs.mkdir(this.objectsPath, { recursive: true });
    await fs.mkdir(this.headsPath, { recursive: true });

    // Initialize default branch
    await this.setBranch('main');
    await this.setHead('main');

    // Create initial config
    const config = {
      version: '1.0',
      author: process.env.USER || 'unknown',
      created: new Date().toISOString()
    };
    await this.writeJSON(path.join(this.vcsPath, 'config.json'), config);

    // Initialize empty staging area
    await this.writeJSON(path.join(this.vcsPath, 'index.json'), {});

    return true;
  }

  async getStagingArea() {
    const stagingFile = path.join(this.vcsPath, 'index.json');
    try {
      return await this.readJSON(stagingFile);
    } catch {
      return {};
    }
  }

  async addToStaging(filePath, contentHash) {
    const staging = await this.getStagingArea();
    staging[filePath] = contentHash;
    await this.writeJSON(path.join(this.vcsPath, 'index.json'), staging);
  }

  async clearStaging() {
    await this.writeJSON(path.join(this.vcsPath, 'index.json'), {});
  }

  async getHead() {
    const headFile = path.join(this.vcsPath, 'HEAD');
    try {
      return (await fs.readFile(headFile, 'utf-8')).trim();
    } catch {
      return null;
    }
  }

  async setHead(commitHash) {
    await fs.writeFile(path.join(this.vcsPath, 'HEAD'), commitHash, 'utf-8');
  }

  async getCurrentBranch() {
    const branchFile = path.join(this.vcsPath, 'BRANCH');
    try {
      return (await fs.readFile(branchFile, 'utf-8')).trim();
    } catch {
      return null;
    }
  }

  async setBranch(branchName) {
    await fs.writeFile(path.join(this.vcsPath, 'BRANCH'), branchName, 'utf-8');
  }

  async getBranchHead(branchName) {
    const branchFile = path.join(this.headsPath, branchName);
    try {
      return (await fs.readFile(branchFile, 'utf-8')).trim();
    } catch {
      return null;
    }
  }

  async setBranchHead(branchName, commitHash) {
    const branchFile = path.join(this.headsPath, branchName);
    await fs.writeFile(branchFile, commitHash, 'utf-8');
  }

  async getCommit(commitHash) {
    const commitFile = path.join(this.objectsPath, commitHash);
    try {
      const data = await this.readJSON(commitFile);
      return Commit.fromJSON(data);
    } catch {
      return null;
    }
  }

  async saveCommit(commit) {
    const commitFile = path.join(this.objectsPath, commit.hash);
    await this.writeJSON(commitFile, commit.toJSON());
  }

  async saveTree(treeHash, treeData) {
    const treeFile = path.join(this.objectsPath, treeHash);
    await this.writeJSON(treeFile, treeData);
  }

  async getTree(treeHash) {
    const treeFile = path.join(this.objectsPath, treeHash);
    try {
      return await this.readJSON(treeFile);
    } catch {
      return null;
    }
  }

  async saveBlob(contentHash, content) {
    const blobFile = path.join(this.objectsPath, contentHash);
    await fs.writeFile(blobFile, content);
  }

  async getBlob(contentHash) {
    const blobFile = path.join(this.objectsPath, contentHash);
    try {
      return await fs.readFile(blobFile);
    } catch {
      return null;
    }
  }

  async getAllBranches() {
    try {
      const files = await fs.readdir(this.headsPath);
      const branchPromises = files.map(async (file) => {
        const filePath = path.join(this.headsPath, file);
        try {
          const stat = await fs.stat(filePath);
          return stat.isFile() ? file : null;
        } catch {
          return null;
        }
      });
      const branches = await Promise.all(branchPromises);
      return branches.filter(b => b !== null);
    } catch {
      return [];
    }
  }

  hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  async readJSON(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  }

  async writeJSON(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getCommitHistory(commitHash, limit = 100) {
    const commits = [];
    let current = commitHash;
    let count = 0;

    while (current && count < limit) {
      const commit = await this.getCommit(current);
      if (!commit) break;
      commits.push(commit);
      current = commit.parent;
      count++;
    }

    return commits;
  }

  async getCommitByOffset(commitHash, offset) {
    let current = commitHash;
    for (let i = 0; i < offset; i++) {
      const commit = await this.getCommit(current);
      if (!commit || !commit.parent) {
        return null;
      }
      current = commit.parent;
    }
    return await this.getCommit(current);
  }
}

module.exports = { Repository, Commit };

