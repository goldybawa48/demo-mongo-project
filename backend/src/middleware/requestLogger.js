const { addLog } = require('../utils/logStore');

function requestLogger(req, res, next) {
  const path = req.path;
  const originalUrl = req.originalUrl;
  const method = req.method;

  res.on('finish', () => {
    if (path === '/logs' || path === '/health') return;
    const type = res.statusCode >= 400 ? 'error' : 'info';
    addLog(type, `${method} ${originalUrl} - ${res.statusCode}`);
  });
  next();
}

module.exports = requestLogger;
