const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const feedRouter = require('./routes/feed');
const logger = require('./utils/logger');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/feed', feedRouter);

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path });
  res.status(500).json({ error: 'Internal server error' });
  next();
});

module.exports = app;
