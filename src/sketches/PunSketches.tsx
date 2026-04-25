/**
 * Six placeholder pun sketches drawn inline. They share the same flat,
 * marker-on-paper aesthetic as the real cards.
 */

const Frame = ({ children, bg = "#FBF7F0" }: { children: React.ReactNode; bg?: string }) => (
  <svg viewBox="0 0 320 240" className="w-full h-full">
    <rect width="320" height="240" fill={bg} />
    {children}
  </svg>
);

export function BeeMine() {
  return (
    <Frame bg="#FFF5D7">
      <text x="20" y="36" fontFamily="Caveat" fontSize="26" fill="#1a1a1a">
        Bee mine?
      </text>
      <g transform="translate(140,90)">
        <ellipse cx="0" cy="0" rx="55" ry="38" fill="#F6C667" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-30 -20 L-30 20 M-10 -30 L-10 30 M10 -32 L10 28 M30 -22 L30 18" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse cx="-40" cy="-20" rx="22" ry="14" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="2" opacity="0.9" />
        <ellipse cx="40" cy="-20" rx="22" ry="14" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="2" opacity="0.9" />
        <circle cx="-12" cy="-2" r="2.4" fill="#1a1a1a" />
        <circle cx="12" cy="-2" r="2.4" fill="#1a1a1a" />
        <path d="M-8 8 q8 6 16 0" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M-30 -38 q-2 -8 4 -10 M30 -38 q2 -8 -4 -10" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      </g>
      <path d="M260 60 q-20 30 0 60 q20 -30 40 0" fill="none" stroke="#FF8A3C" strokeWidth="2" strokeDasharray="3 4" />
      <path d="M30 200 q20 -10 40 0" fill="none" stroke="#FF8A3C" strokeWidth="2" strokeDasharray="3 4" />
    </Frame>
  );
}

export function PawsitiveVibes() {
  return (
    <Frame bg="#E8F4FF">
      <text x="20" y="36" fontFamily="Caveat" fontSize="26" fill="#1a1a1a">
        Sending pawsitive
      </text>
      <text x="20" y="64" fontFamily="Caveat" fontSize="26" fill="#1a1a1a">
        vibes your way.
      </text>
      <g transform="translate(180,140)">
        <circle cx="0" cy="0" r="38" fill="#1a1a1a" />
        <circle cx="-14" cy="-28" r="10" fill="#1a1a1a" />
        <circle cx="14" cy="-28" r="10" fill="#1a1a1a" />
        <circle cx="-26" cy="-12" r="7" fill="#1a1a1a" />
        <circle cx="26" cy="-12" r="7" fill="#1a1a1a" />
        <circle cx="0" cy="-6" r="5" fill="#FBF7F0" />
      </g>
      <g transform="translate(70,170)" stroke="#1a1a1a" strokeWidth="2" fill="none">
        <circle cx="0" cy="0" r="8" />
        <circle cx="-9" cy="-12" r="4" />
        <circle cx="9" cy="-12" r="4" />
        <circle cx="-14" cy="2" r="3.5" />
        <circle cx="14" cy="2" r="3.5" />
      </g>
    </Frame>
  );
}

export function YouRock() {
  return (
    <Frame bg="#F4ECFF">
      <text x="20" y="40" fontFamily="Caveat" fontSize="30" fill="#1a1a1a">
        You rock!
      </text>
      <g transform="translate(160,140)">
        <path
          d="M-60 30 Q -80 -10, -30 -40 Q 30 -55, 60 -20 Q 85 30, 30 50 Q -30 60, -60 30 Z"
          fill="#B8A6E0"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <circle cx="-15" cy="-10" r="3" fill="#1a1a1a" />
        <circle cx="20" cy="-12" r="3" fill="#1a1a1a" />
        <path d="M-15 12 q15 14 35 0" fill="none" stroke="#1a1a1a" strokeWidth="2.4" />
        <path d="M-30 -32 l-6 -10 M0 -38 l0 -12 M28 -32 l6 -10" stroke="#1a1a1a" strokeWidth="2" />
      </g>
    </Frame>
  );
}

export function DonutWorry() {
  return (
    <Frame bg="#FFE5EE">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Donut worry,
      </text>
      <text x="20" y="70" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        be happy.
      </text>
      <g transform="translate(190,140)">
        <circle cx="0" cy="0" r="60" fill="#F6C667" stroke="#1a1a1a" strokeWidth="3" />
        <path
          d="M-50 -10 Q -40 -50, 0 -45 Q 50 -50, 50 0 Q 55 35, 10 45 Q -45 50, -50 -10 Z"
          fill="#FFC0D9"
          stroke="#1a1a1a"
          strokeWidth="2.5"
        />
        <circle cx="0" cy="0" r="18" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="-22" cy="-22" r="3" fill="#FF4D8D" />
        <circle cx="20" cy="-18" r="3" fill="#4A90E2" />
        <circle cx="-10" cy="20" r="3" fill="#6FCF97" />
        <circle cx="22" cy="14" r="3" fill="#FF8A3C" />
        <circle cx="-26" cy="6" r="3" fill="#FF4D8D" />
      </g>
    </Frame>
  );
}

export function BerrySpecial() {
  return (
    <Frame bg="#FFF0F0">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        You're berry special.
      </text>
      <g transform="translate(170,150)">
        <path
          d="M-50 -30 Q -55 30, 0 60 Q 55 30, 50 -30 Q 30 -50, 0 -40 Q -30 -50, -50 -30 Z"
          fill="#FF4D8D"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <path d="M-30 -28 l5 -20 M0 -42 l0 -22 M30 -28 l-5 -20" fill="none" stroke="#6FCF97" strokeWidth="3" strokeLinecap="round" />
        <g fill="#FBF7F0">
          <circle cx="-25" cy="-5" r="2" />
          <circle cx="-10" cy="10" r="2" />
          <circle cx="12" cy="-5" r="2" />
          <circle cx="22" cy="14" r="2" />
          <circle cx="-2" cy="32" r="2" />
          <circle cx="-30" cy="20" r="2" />
        </g>
        <circle cx="-12" cy="0" r="2.5" fill="#1a1a1a" />
        <circle cx="14" cy="0" r="2.5" fill="#1a1a1a" />
        <path d="M-10 12 q12 8 24 0" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      </g>
    </Frame>
  );
}

export function SunSational() {
  return (
    <Frame bg="#FFF8E1">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        You're sun-sational.
      </text>
      <g transform="translate(170,140)">
        <g stroke="#FF8A3C" strokeWidth="3" strokeLinecap="round">
          <line x1="-70" y1="0" x2="-90" y2="0" />
          <line x1="70" y1="0" x2="90" y2="0" />
          <line x1="0" y1="-70" x2="0" y2="-90" />
          <line x1="0" y1="70" x2="0" y2="90" />
          <line x1="-50" y1="-50" x2="-65" y2="-65" />
          <line x1="50" y1="-50" x2="65" y2="-65" />
          <line x1="50" y1="50" x2="65" y2="65" />
          <line x1="-50" y1="50" x2="-65" y2="65" />
        </g>
        <circle cx="0" cy="0" r="55" fill="#F6C667" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="-15" cy="-5" r="3" fill="#1a1a1a" />
        <circle cx="15" cy="-5" r="3" fill="#1a1a1a" />
        <path d="M-15 12 q15 14 30 0" fill="none" stroke="#1a1a1a" strokeWidth="2.4" />
        <circle cx="-22" cy="14" r="4" fill="#FF4D8D" opacity="0.55" />
        <circle cx="22" cy="14" r="4" fill="#FF4D8D" opacity="0.55" />
      </g>
    </Frame>
  );
}
