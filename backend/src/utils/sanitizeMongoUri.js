function sanitizeMongoUri(uri) {
  if (!uri) return 'not-configured';

  const match = uri.match(/^mongodb(?:\+srv)?:\/\/(?:[^@/]+@)?([^/?]+)\/?([^?]*)/i);
  if (!match) return 'invalid-uri';

  const hostPart = match[1] || 'unknown-host';
  const dbName = match[2] || 'unknown-db';

  return `${hostPart}/${dbName}`;
}

module.exports = sanitizeMongoUri;
