export function GotYourBack() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full">
      <rect width="320" height="240" fill="#FBF7F0" />
      <text x="20" y="36" fontFamily="Caveat" fontSize="24" fill="#1a1a1a">
        Happy Birthday
      </text>

      {/* front stick figure */}
      <g transform="translate(120,80)">
        <circle cx="0" cy="0" r="22" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="-7" cy="-3" r="2" fill="#1a1a1a" />
        <circle cx="7" cy="-3" r="2" fill="#1a1a1a" />
        <path d="M-7 7 q7 6 14 0" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        {/* bow */}
        <path d="M-14 -18 l-6 -4 l4 8 z m0 0 l6 -4 l-4 8 z" fill="#FF4D8D" />
        <line x1="0" y1="22" x2="0" y2="80" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="40" x2="-22" y2="55" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="40" x2="22" y2="55" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="80" x2="-16" y2="120" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="80" x2="16" y2="120" stroke="#1a1a1a" strokeWidth="3" />
      </g>

      {/* back stick figure (behind, 'has your back') */}
      <g transform="translate(200,90)" opacity="0.95">
        <circle cx="0" cy="0" r="20" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="-6" cy="-2" r="1.6" fill="#1a1a1a" />
        <circle cx="6" cy="-2" r="3" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
        <line x1="0" y1="20" x2="0" y2="70" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="36" x2="-30" y2="40" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="36" x2="26" y2="42" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="70" x2="-14" y2="105" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="70" x2="14" y2="105" stroke="#1a1a1a" strokeWidth="3" />
      </g>

      <text x="20" y="220" fontFamily="Kalam" fontSize="16" fill="#1a1a1a">
        I literally got your back :)
      </text>
    </svg>
  );
}
