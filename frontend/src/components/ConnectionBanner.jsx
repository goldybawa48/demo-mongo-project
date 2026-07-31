export default function ConnectionBanner({ backendConnected, mongoConnected }) {
  const message = !backendConnected
    ? 'Backend Unreachable — retrying automatically...'
    : 'MongoDB Connection Lost — retrying automatically...';

  return (
    <div className="connection-banner">
      <span className="banner-icon">⚠</span>
      {message}
    </div>
  );
}
