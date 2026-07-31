const { getLogs } = require('../utils/logStore');

function getLogsHandler(req, res) {
  res.json({ success: true, data: getLogs() });
}

module.exports = { getLogsHandler };
