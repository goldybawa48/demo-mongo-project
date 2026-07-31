export default function HealthCard({ health, backendConnected }) {
  return (
    <section className="card glass health-card">
      <h2>Health Check</h2>

      {!health ? (
        <p className="muted">Checking backend health...</p>
      ) : (
        <div className="health-grid">
          <div className="health-item">
            <span className="health-label">Backend Status</span>
            <span className={`badge ${backendConnected ? 'badge-green' : 'badge-red'}`}>
              {backendConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div className="health-item">
            <span className="health-label">MongoDB Connected</span>
            <span className={`badge ${health.mongoConnected ? 'badge-green' : 'badge-red'}`}>
              {health.mongoConnected ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="health-item">
            <span className="health-label">Database Name</span>
            <span className="health-value">{health.databaseName || '—'}</span>
          </div>

          <div className="health-item">
            <span className="health-label">Collection Name</span>
            <span className="health-value">{health.collectionName || '—'}</span>
          </div>

          <div className="health-item">
            <span className="health-label">Server Time</span>
            <span className="health-value">
              {health.serverTime ? new Date(health.serverTime).toLocaleString() : '—'}
            </span>
          </div>

          <div className="health-item">
            <span className="health-label">Total Users</span>
            <span className="health-value">{health.totalUsers ?? '—'}</span>
          </div>
        </div>
      )}
    </section>
  );
}
