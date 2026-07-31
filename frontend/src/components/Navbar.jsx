import { useEffect, useState } from 'react';

export default function Navbar({ appName, backendConnected, mongoConnected, environment }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="navbar glass">
      <div className="navbar-brand">
        <span className="brand-dot" />
        <h1>{appName}</h1>
      </div>

      <div className="navbar-status">
        <div className="status-pill">
          <span className={`status-dot ${backendConnected ? 'dot-green' : 'dot-red'}`} />
          Backend {backendConnected ? 'Connected' : 'Disconnected'}
        </div>

        <div className="status-pill">
          <span className={`status-dot ${mongoConnected ? 'dot-green' : 'dot-red'}`} />
          MongoDB {mongoConnected ? 'Connected' : 'Not Connected'}
        </div>

        {environment && <div className="status-pill env-pill">{environment}</div>}

        <div className="status-pill clock-pill">{now.toLocaleTimeString()}</div>
      </div>
    </header>
  );
}
