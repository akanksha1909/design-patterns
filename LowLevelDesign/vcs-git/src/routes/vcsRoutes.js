/**
 * VCS API Routes - Extensible command pattern implementation
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const { Repository, Commit } = require('../core/Repository');
const FileOperations = require('../core/FileOperations');

// Initialize repository and file operations
const repoPath = process.env.REPO_PATH || process.cwd();
const repo = new Repository(repoPath);
const fileOps = new FileOperations(repoPath);

/**
 * POST /api/vcs/init
 * Initialize a new repository
 */
router.post('/init', async (req, res) => {
  try {
    const initialized = await repo.init();
    if (initialized) {
      res.json({
        success: true,
        message: `Initialized empty VCS repository in ${repo.vcsPath}`
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Repository already initialized'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/vcs/add
 * Add files matching regex to staging area
 * Body: { pattern: "<regex>" }
 */
router.post('/add', async (req, res) => {
  try {
    if (!await repo.isInitialized()) {
      return res.status(400).json({
        success: false,
        message: 'Not a VCS repository. Run init first.'
      });
    }

    const { pattern } = req.body;
    if (!pattern) {
      return res.status(400).json({
        success: false,
        message: 'Pattern is required'
      });
    }

    const files = await fileOps.findFilesByRegex(pattern);
    
    if (files.length === 0) {
      return res.json({
        success: true,
        message: `No files found matching pattern: ${pattern}`,
        files: []
      });
    }

    let addedCount = 0;
    for (const filePath of files) {
      const content = await fileOps.getFileContent(filePath);
      if (content) {
        const contentHash = repo.hashContent(content);
        await repo.saveBlob(contentHash, content);
        await repo.addToStaging(filePath, contentHash);
        addedCount++;
      }
    }

    res.json({
      success: true,
      message: `Added ${addedCount} file(s) to staging area`,
      files: files.slice(0, 10) // Return first 10 for preview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/vcs/commit
 * Commit staged changes
 * Body: { message: "<message>", all: false }  // all=true for -am flag
 */
router.post('/commit', async (req, res) => {
  try {
    if (!await repo.isInitialized()) {
      return res.status(400).json({
        success: false,
        message: 'Not a VCS repository. Run init first.'
      });
    }

    const { message, all } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Commit message is required'
      });
    }

    // If -am flag, add all modified files first
    if (all) {
      const allFiles = await fileOps.getAllTrackedFiles();
      for (const filePath of allFiles) {
        const content = await fileOps.getFileContent(filePath);
        if (content) {
          const contentHash = repo.hashContent(content);
          await repo.saveBlob(contentHash, content);
          await repo.addToStaging(filePath, contentHash);
        }
      }
    }

    const staging = await repo.getStagingArea();
    if (Object.keys(staging).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nothing to commit. Staging area is empty.'
      });
    }

    // Create tree object
    const treeHash = repo.hashContent(JSON.stringify(staging));
    await repo.saveTree(treeHash, staging);

    // Get current HEAD
    const currentHead = await repo.getHead();
    const currentBranch = await repo.getCurrentBranch();

    // Create commit
    const commitData = JSON.stringify({
      message,
      parent: currentHead,
      author: process.env.USER || 'unknown',
      timestamp: new Date().toISOString(),
      treeHash
    });
    const commitHash = repo.hashContent(commitData);

    const commit = new Commit(
      commitHash,
      message,
      currentHead,
      process.env.USER || 'unknown',
      new Date(),
      treeHash
    );

    await repo.saveCommit(commit);
    await repo.setHead(commitHash);
    if (currentBranch) {
      await repo.setBranchHead(currentBranch, commitHash);
    }

    // Clear staging area
    await repo.clearStaging();

    res.json({
      success: true,
      message: `Committed ${Object.keys(staging).length} file(s)`,
      commit: {
        hash: commitHash,
        message,
        timestamp: commit.timestamp.toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/vcs/checkout
 * Checkout a branch or create new branch
 * Body: { branch: "<branch>", create: false }  // create=true for -b flag
 */
router.post('/checkout', async (req, res) => {
  try {
    if (!await repo.isInitialized()) {
      return res.status(400).json({
        success: false,
        message: 'Not a VCS repository. Run init first.'
      });
    }

    const { branch, create } = req.body;
    if (!branch) {
      return res.status(400).json({
        success: false,
        message: 'Branch name is required'
      });
    }

    const branchHead = await repo.getBranchHead(branch);

    if (create) {
      // Create new branch
      if (branchHead) {
        return res.status(400).json({
          success: false,
          message: `Branch '${branch}' already exists`
        });
      }

      const currentHead = await repo.getHead();
      await repo.setBranchHead(branch, currentHead);
      await repo.setBranch(branch);
      await repo.setHead(currentHead);

      res.json({
        success: true,
        message: `Created and switched to branch '${branch}'`
      });
    } else {
      // Switch to existing branch
      if (!branchHead) {
        return res.status(400).json({
          success: false,
          message: `Branch '${branch}' does not exist`
        });
      }

      // Restore files from the branch's commit
      const commit = await repo.getCommit(branchHead);
      if (commit) {
        const tree = await repo.getTree(commit.treeHash);
        if (tree) {
          // Clear working directory (optional - can be made configurable)
          // Restore files from tree
          for (const [filePath, contentHash] of Object.entries(tree)) {
            const content = await repo.getBlob(contentHash);
            if (content) {
              await fileOps.writeFileContent(filePath, content);
            }
          }
        }
      }

      await repo.setBranch(branch);
      await repo.setHead(branchHead);

      res.json({
        success: true,
        message: `Switched to branch '${branch}'`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/vcs/reset
 * Reset HEAD to a previous commit
 * Body: { offset: <number> }  // e.g., offset: 1 for HEAD~1
 */
router.post('/reset', async (req, res) => {
  try {
    if (!await repo.isInitialized()) {
      return res.status(400).json({
        success: false,
        message: 'Not a VCS repository. Run init first.'
      });
    }

    const { offset } = req.body;
    if (offset === undefined || offset < 1) {
      return res.status(400).json({
        success: false,
        message: 'Offset must be a positive integer (e.g., 1 for HEAD~1)'
      });
    }

    const currentHead = await repo.getHead();
    if (!currentHead) {
      return res.status(400).json({
        success: false,
        message: 'No commits found'
      });
    }

    const targetCommit = await repo.getCommitByOffset(currentHead, offset);
    if (!targetCommit) {
      return res.status(400).json({
        success: false,
        message: `Cannot reset: HEAD~${offset} does not exist`
      });
    }

    // Restore files from target commit
    const tree = await repo.getTree(targetCommit.treeHash);
    if (tree) {
      for (const [filePath, contentHash] of Object.entries(tree)) {
        const content = await repo.getBlob(contentHash);
        if (content) {
          await fileOps.writeFileContent(filePath, content);
        }
      }
    }

    const currentBranch = await repo.getCurrentBranch();
    await repo.setHead(targetCommit.hash);
    if (currentBranch) {
      await repo.setBranchHead(currentBranch, targetCommit.hash);
    }

    res.json({
      success: true,
      message: `Reset HEAD to ${targetCommit.hash.substring(0, 8)}`,
      commit: {
        hash: targetCommit.hash,
        message: targetCommit.message,
        timestamp: targetCommit.timestamp.toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/vcs/status
 * Get repository status
 */
router.get('/status', async (req, res) => {
  try {
    if (!await repo.isInitialized()) {
      return res.status(400).json({
        success: false,
        message: 'Not a VCS repository. Run init first.'
      });
    }

    const staging = await repo.getStagingArea();
    const currentBranch = await repo.getCurrentBranch();
    const head = await repo.getHead();
    const allFiles = await fileOps.getAllTrackedFiles();

    // Find modified, untracked, and staged files
    const stagedFiles = Object.keys(staging);
    const modifiedFiles = [];
    const untrackedFiles = [];

    for (const filePath of allFiles) {
      const currentHash = await fileOps.getFileHash(filePath);
      const stagedHash = staging[filePath];

      if (!stagedHash) {
        untrackedFiles.push(filePath);
      } else if (currentHash !== stagedHash) {
        modifiedFiles.push(filePath);
      }
    }

    let commit = null;
    if (head) {
      commit = await repo.getCommit(head);
    }

    res.json({
      success: true,
      branch: currentBranch || 'main',
      commit: commit ? {
        hash: commit.hash.substring(0, 8),
        message: commit.message,
        timestamp: commit.timestamp.toISOString()
      } : null,
      staged: stagedFiles.length,
      modified: modifiedFiles.length,
      untracked: untrackedFiles.length,
      files: {
        staged: stagedFiles.slice(0, 20),
        modified: modifiedFiles.slice(0, 20),
        untracked: untrackedFiles.slice(0, 20)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/vcs/log
 * Get commit history
 * Query: ?limit=50
 */
router.get('/log', async (req, res) => {
  try {
    if (!await repo.isInitialized()) {
      return res.status(400).json({
        success: false,
        message: 'Not a VCS repository. Run init first.'
      });
    }

    const limit = parseInt(req.query.limit) || 50;
    const head = await repo.getHead();

    if (!head) {
      return res.json({
        success: true,
        commits: []
      });
    }

    const commits = await repo.getCommitHistory(head, limit);

    res.json({
      success: true,
      commits: commits.map(commit => ({
        hash: commit.hash.substring(0, 8),
        message: commit.message,
        author: commit.author,
        timestamp: commit.timestamp.toISOString(),
        parent: commit.parent ? commit.parent.substring(0, 8) : null
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/vcs/diff
 * Get diff between working directory and HEAD, or between two commits
 * Query: ?commit1=<hash>&commit2=<hash> (optional, defaults to HEAD vs working dir)
 */
router.get('/diff', async (req, res) => {
  try {
    if (!await repo.isInitialized()) {
      return res.status(400).json({
        success: false,
        message: 'Not a VCS repository. Run init first.'
      });
    }

    const { commit1, commit2 } = req.query;
    const diffs = {};

    if (commit1 && commit2) {
      // Diff between two commits
      const commit1Obj = await repo.getCommit(commit1);
      const commit2Obj = await repo.getCommit(commit2);

      if (!commit1Obj || !commit2Obj) {
        return res.status(400).json({
          success: false,
          message: 'One or both commits not found'
        });
      }

      const tree1 = await repo.getTree(commit1Obj.treeHash);
      const tree2 = await repo.getTree(commit2Obj.treeHash);

      const allFiles = new Set([
        ...Object.keys(tree1 || {}),
        ...Object.keys(tree2 || {})
      ]);

      for (const filePath of allFiles) {
        const hash1 = tree1?.[filePath];
        const hash2 = tree2?.[filePath];

        if (hash1 !== hash2) {
          const content1 = hash1 ? await repo.getBlob(hash1) : null;
          const content2 = hash2 ? await repo.getBlob(hash2) : null;
          diffs[filePath] = await fileOps.getFileDiff(filePath, content1, content2);
        }
      }
    } else {
      // Diff between HEAD and working directory
      const head = await repo.getHead();
      const staging = await repo.getStagingArea();
      const allFiles = await fileOps.getAllTrackedFiles();

      if (head) {
        const commit = await repo.getCommit(head);
        const tree = await repo.getTree(commit.treeHash);

        for (const filePath of allFiles) {
          const currentContent = await fileOps.getFileContent(filePath);
          const currentHash = currentContent ? repo.hashContent(currentContent) : null;
          const headHash = tree?.[filePath];

          if (currentHash !== headHash) {
            const headContent = headHash ? await repo.getBlob(headHash) : null;
            diffs[filePath] = await fileOps.getFileDiff(filePath, headContent, currentContent);
          }
        }
      } else {
        // No commits yet, show all files as new
        for (const filePath of allFiles) {
          const content = await fileOps.getFileContent(filePath);
          if (content) {
            diffs[filePath] = await fileOps.getFileDiff(filePath, null, content);
          }
        }
      }
    }

    res.json({
      success: true,
      diffCount: Object.keys(diffs).length,
      diffs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/vcs/help
 * Get help information for all commands
 */
router.get('/help', (req, res) => {
  res.json({
    success: true,
    commands: {
      init: {
        method: 'POST',
        endpoint: '/api/vcs/init',
        description: 'Initialize a new VCS repository in the current directory',
        example: 'POST /api/vcs/init'
      },
      add: {
        method: 'POST',
        endpoint: '/api/vcs/add',
        description: 'Add files matching regex pattern to staging area',
        body: { pattern: '<regex>' },
        example: 'POST /api/vcs/add { "pattern": ".*\\.js$" }'
      },
      commit: {
        method: 'POST',
        endpoint: '/api/vcs/commit',
        description: 'Commit staged changes. Use all=true for -am flag (add and commit)',
        body: { message: '<message>', all: false },
        example: 'POST /api/vcs/commit { "message": "Initial commit", "all": false }'
      },
      checkout: {
        method: 'POST',
        endpoint: '/api/vcs/checkout',
        description: 'Checkout a branch. Use create=true for -b flag (create new branch)',
        body: { branch: '<branch>', create: false },
        example: 'POST /api/vcs/checkout { "branch": "feature", "create": true }'
      },
      reset: {
        method: 'POST',
        endpoint: '/api/vcs/reset',
        description: 'Reset HEAD to a previous commit (HEAD~offset)',
        body: { offset: <number> },
        example: 'POST /api/vcs/reset { "offset": 1 }'
      },
      status: {
        method: 'GET',
        endpoint: '/api/vcs/status',
        description: 'Show repository status',
        example: 'GET /api/vcs/status'
      },
      log: {
        method: 'GET',
        endpoint: '/api/vcs/log',
        description: 'Show commit history',
        query: { limit: 50 },
        example: 'GET /api/vcs/log?limit=50'
      },
      diff: {
        method: 'GET',
        endpoint: '/api/vcs/diff',
        description: 'Show differences between commits or working directory',
        query: { commit1: '<hash>', commit2: '<hash>' },
        example: 'GET /api/vcs/diff?commit1=abc123&commit2=def456'
      },
      help: {
        method: 'GET',
        endpoint: '/api/vcs/help',
        description: 'Show this help message',
        example: 'GET /api/vcs/help'
      }
    }
  });
});

module.exports = router;

