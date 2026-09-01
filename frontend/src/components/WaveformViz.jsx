// WaveformViz.jsx — Animated waveform visualization

/**
 * Props:
 *   isPlaying: boolean — controls animation
 *   bars?: number      — number of bars (default 32)
 */
export default function WaveformViz({ isPlaying, bars = 32 }) {
  // Generate pseudo-random heights seeded for consistency
  const heights = Array.from({ length: bars }, (_, i) => {
    const seed = Math.sin(i * 7.3 + 1.5) * 0.5 + 0.5;
    return 20 + Math.floor(seed * 80); // 20% to 100% of max
  });

  return (
    <div className="waveform" aria-hidden="true">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`waveform-bar${isPlaying ? ' waveform-bar--playing' : ''}`}
          style={{
            height: `${h}%`,
            '--duration': `${0.5 + (i % 5) * 0.15}s`,
            '--delay':    `${(i % 7) * 0.07}s`,
            opacity: isPlaying ? 0.85 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
