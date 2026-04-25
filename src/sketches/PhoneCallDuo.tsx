export function PhoneCallDuo() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full">
      <rect width="320" height="240" fill="#FBE4EC" />
      {/* Two panels */}
      <rect x="10" y="20" width="140" height="200" fill="#FBE4EC" stroke="#1a1a1a" strokeWidth="3" />
      <rect x="170" y="20" width="140" height="200" fill="#FBE4EC" stroke="#1a1a1a" strokeWidth="3" />

      {/* Left blob with phone */}
      <g transform="translate(40,60)">
        <path
          d="M10 60 Q 0 20, 50 15 Q 90 18, 80 60 Q 95 90, 60 95 Q 25 100, 10 60 Z"
          fill="#FBF7F0"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <text x="32" y="44" fontFamily="Kalam" fontSize="22" fill="#1a1a1a">
          ^_^
        </text>
        <rect x="60" y="70" width="14" height="22" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="2.4" />
      </g>

      {/* Right blob with phone */}
      <g transform="translate(195,55)">
        <path
          d="M10 60 Q 0 20, 50 15 Q 95 12, 88 55 Q 100 90, 55 100 Q 18 105, 10 60 Z"
          fill="#FBF7F0"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <text x="32" y="44" fontFamily="Kalam" fontSize="22" fill="#1a1a1a">
          :)
        </text>
        <rect x="62" y="62" width="14" height="22" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="2.4" transform="rotate(20 69 73)" />
      </g>

      {/* heart string */}
      <path
        d="M120 130 Q 160 150, 200 130 Q 230 110, 260 130"
        fill="none"
        stroke="#FF4D8D"
        strokeWidth="2.5"
      />
      <path d="M155 138 l-2 -3 a2 2 0 1 1 4 0 a2 2 0 1 1 4 0 l-2 3 z" fill="#FF4D8D" />
      <path d="M225 124 l-2 -3 a2 2 0 1 1 4 0 a2 2 0 1 1 4 0 l-2 3 z" fill="#FF4D8D" />

      <text x="14" y="16" fontFamily="Caveat" fontSize="20" fill="#1a1a1a">
        Happy Birthday girl!
      </text>
    </svg>
  );
}
