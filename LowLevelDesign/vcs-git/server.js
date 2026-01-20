/**
 * Express server for VCS API
 */
const express = require('express');
const cors = require('cors');
const vcsRoutes = require('./src/routes/vcsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/vcs', vcsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'VCS API Server',
    version: '1.0.0',
    endpoints: {
      help: '/api/vcs/help',
      init: 'POST /api/vcs/init',
      add: 'POST /api/vcs/add',
      commit: 'POST /api/vcs/commit',
      checkout: 'POST /api/vcs/checkout',
      reset: 'POST /api/vcs/reset',
      status: 'GET /api/vcs/status',
      log: 'GET /api/vcs/log',
      diff: 'GET /api/vcs/diff'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`VCS API Server running on http://localhost:${PORT}`);
  console.log(`Repository path: ${process.env.REPO_PATH || process.cwd()}`);
  console.log(`Use GET /api/vcs/help for API documentation`);
});

module.exports = app;

