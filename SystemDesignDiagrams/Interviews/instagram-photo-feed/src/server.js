const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const server = app.listen(config.port, () => {
  logger.info(`Instagram feed API listening on port ${config.port}`);
});

server.on('error', (error) => {
  logger.error('Server failed to start', { error: error.message });
  process.exit(1);
});
