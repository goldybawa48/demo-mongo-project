export default function LogsWindow({ logs }) {
  return (
    <section className="card glass logs-card">
      <h2>Application Logs</h2>

      <div className="logs-window">
        {logs.length === 0 ? (
          <p className="muted">No activity yet.</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className={`log-line log-${log.type}`}>
              <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
