function formatUptime(seconds) {
  if (seconds == null) return '—';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export default function OverviewCard({ appName, version, uptimeSeconds }) {
  return (
    <section className="card glass overview-card">
      <h2>System Overview</h2>

      <p className="overview-blurb">
        This dashboard showcases a live connection between {appName || 'the application'} and its
        database, with real-time health monitoring and automatic recovery from outages.
      </p>

      <div className="overview-stats">
        <div className="overview-stat">
          <span className="overview-stat-label">App Version</span>
          <span className="overview-stat-value">{version || '—'}</span>
        </div>

        <div className="overview-stat">
          <span className="overview-stat-label">Uptime</span>
          <span className="overview-stat-value">{formatUptime(uptimeSeconds)}</span>
        </div>
      </div>
    </section>
  );
}
