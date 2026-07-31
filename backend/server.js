const app = require('./src/app');
const config = require('./src/config/env');
const { connectDB } = require('./src/config/db');

connectDB();

app.listen(config.port, () => {
  console.log(`${config.appName} backend running on port ${config.port} [${config.nodeEnv}]`);
});
