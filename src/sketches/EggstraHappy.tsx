export function EggstraHappy() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full">
      <rect width="320" height="240" fill="#FBF7F0" />
      <text x="20" y="40" fontFamily="Caveat" fontSize="24" fill="#1a1a1a">
        You make my life
      </text>
      <text x="20" y="68" fontFamily="Caveat" fontSize="24" fill="#1a1a1a">
        Egg-stra happy.
      </text>

      {/* Egg 1 */}
      <g transform="translate(180,40)">
        <path
          d="M40 0 C 90 5, 100 70, 60 90 C 20 105, -5 70, 5 35 C 12 15, 22 5, 40 0 Z"
          fill="#A9CCEB"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <circle cx="48" cy="50" r="14" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="44" cy="48" r="2" fill="#1a1a1a" />
        <circle cx="52" cy="48" r="2" fill="#1a1a1a" />
        <path d="M42 54 q6 4 12 0" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
        {/* legs */}
        <path d="M20 10 l-6 -8" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M20 90 l-8 8" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M70 90 l8 10" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      </g>

      {/* Egg 2 */}
      <g transform="translate(110,140)">
        <path
          d="M40 5 C 95 5, 105 60, 70 90 C 30 110, -5 75, 8 40 C 14 18, 24 8, 40 5 Z"
          fill="#A9CCEB"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <circle cx="50" cy="55" r="14" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="46" cy="53" r="2" fill="#1a1a1a" />
        <circle cx="54" cy="53" r="2" fill="#1a1a1a" />
        <path d="M44 59 q6 4 12 0" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
        <path d="M70 0 l8 -8" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M14 90 l-8 10" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M85 70 l10 6" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}
