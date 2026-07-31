module.exports = {
  apps: [
    {
      name: 'devops-demo-backend',
      cwd: './backend',
      script: 'server.js',
      interpreter: 'node',
      autorestart: true,
      max_restarts: 10,
      watch: false,
    },
    {
      name: 'devops-demo-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      interpreter: 'none',
      autorestart: true,
      watch: false,
    },
  ],
};
