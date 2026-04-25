export function BestTea() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-full">
      <rect width="320" height="240" fill="#FBF7F0" />
      <text
        x="22"
        y="34"
        fontFamily="Caveat, cursive"
        fontSize="26"
        fill="#1a1a1a"
      >
        Happy Birthday
      </text>
      <text
        x="138"
        y="120"
        fontFamily="Kalam, cursive"
        fontSize="18"
        fill="#1a1a1a"
      >
        to my
      </text>
      <text
        x="22"
        y="220"
        fontFamily="Caveat, cursive"
        fontSize="28"
        fill="#1a1a1a"
      >
        Best-tea
      </text>

      {/* Tea bag 1 */}
      <g transform="translate(200,30) rotate(-8)">
        <path
          d="M0 10 L60 10 L70 90 L-10 90 Z"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x="22" y="34" width="20" height="38" fill="#FF8A3C" />
        <path
          d="M14 30 q4 6 8 0"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <path
          d="M40 30 q4 6 8 0"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <path
          d="M30 0 q-15 -10 -25 0 q-5 8 5 12"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <rect
          x="-25"
          y="8"
          width="14"
          height="10"
          fill="#FF8A3C"
          stroke="#1a1a1a"
        />
      </g>

      {/* Tea bag 2 */}
      <g transform="translate(160,130) rotate(15)">
        <path
          d="M0 10 L70 10 L80 100 L-10 100 Z"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <rect x="28" y="40" width="22" height="42" fill="#FF8A3C" />
        <path
          d="M16 36 q4 6 8 0"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <path
          d="M48 36 q4 6 8 0"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <path
          d="M30 0 q-12 -8 -22 2 q-4 6 4 10"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
        <rect
          x="-22"
          y="6"
          width="14"
          height="10"
          fill="#FF8A3C"
          stroke="#1a1a1a"
        />
      </g>

      {/* hearts */}
      <path d="M60 60 l-3 -4 a3 3 0 1 1 6 0 a3 3 0 1 1 6 0 l-3 4 z" fill="#FF4D8D" transform="translate(40,30)"/>
      <path d="M60 60 l-3 -4 a3 3 0 1 1 6 0 a3 3 0 1 1 6 0 l-3 4 z" fill="#FF4D8D" transform="translate(170,150)"/>
      <circle cx="50" cy="100" r="3" fill="none" stroke="#FF8A3C" strokeWidth="1.5"/>
      <circle cx="280" cy="180" r="3" fill="none" stroke="#FF8A3C" strokeWidth="1.5"/>
    </svg>
  );
}
