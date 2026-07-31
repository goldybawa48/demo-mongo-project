const MAX_LOGS = 100;

const logs = [];

function addLog(type, message) {
  const entry = {
    type,
    message,
    timestamp: new Date().toISOString(),
  };

  logs.unshift(entry);
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }

  return entry;
}

function getLogs() {
  return logs;
}

module.exports = { addLog, getLogs };
