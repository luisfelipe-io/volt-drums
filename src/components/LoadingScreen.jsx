// LoadingScreen.jsx — Shown during initial sample preload
// Disappears as soon as priority samples (kick, snare, hihat) are loaded

export default function LoadingScreen({ progress, loaded, total }) {
  const pct = Math.round(progress * 100)

  return (
    <div className="loading-screen">
      <div className="loading-inner">
        <div className="loading-brand">DRUM SESSIONS</div>
        <div className="loading-sub">Loading professional samples...</div>
        <div className="loading-bar-wrap">
          <div className="loading-bar" style={{width: `${pct}%`}}/>
        </div>
        <div className="loading-count">
          {loaded} / {total} samples
        </div>
      </div>
    </div>
  )
}
