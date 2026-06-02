function info(message, meta = {}) {
  process.stdout.write(`${new Date().toISOString()} [INFO] ${message} ${JSON.stringify(meta)}\n`);
}

function warn(message, meta = {}) {
  process.stdout.write(`${new Date().toISOString()} [WARN] ${message} ${JSON.stringify(meta)}\n`);
}

function error(message, meta = {}) {
  process.stderr.write(`${new Date().toISOString()} [ERROR] ${message} ${JSON.stringify(meta)}\n`);
}

module.exports = {
  info,
  warn,
  error,
};
