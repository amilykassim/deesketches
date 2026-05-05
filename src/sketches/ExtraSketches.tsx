/**
 * Additional inline-SVG sketches added to support multi-card narrative composer.
 * Same flat, marker-on-paper aesthetic as PunSketches.tsx.
 */

const Frame = ({
  children,
  bg = "#FBF7F0",
}: {
  children: React.ReactNode;
  bg?: string;
}) => (
  <svg viewBox="0 0 320 240" className="w-full h-full">
    <rect width="320" height="240" fill={bg} />
    {children}
  </svg>
);

// ── BIRTHDAY ───────────────────────────────────────────────────────────────

export function CakeForYou() {
  return (
    <Frame bg="#FFF1F5">
      <text x="20" y="38" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        It's cake o'clock!
      </text>
      <g transform="translate(160,170)">
        <rect x="-70" y="-30" width="140" height="50" fill="#FFC0D9" stroke="#1a1a1a" strokeWidth="3" rx="4" />
        <rect x="-50" y="-60" width="100" height="32" fill="#F6C667" stroke="#1a1a1a" strokeWidth="3" rx="4" />
        <path d="M-70 -30 q70 14 140 0" fill="none" stroke="#FF4D8D" strokeWidth="2" />
        <path d="M-50 -60 q50 10 100 0" fill="none" stroke="#FF8A3C" strokeWidth="2" />
        <line x1="0" y1="-72" x2="0" y2="-90" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M-3 -90 q3 -8 6 0" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="-30" y1="-72" x2="-30" y2="-86" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M-33 -86 q3 -7 6 0" fill="#4A90E2" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="30" y1="-72" x2="30" y2="-86" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M27 -86 q3 -7 6 0" fill="#6FCF97" stroke="#1a1a1a" strokeWidth="1.4" />
      </g>
      <path d="M30 60 q12 -10 24 0" fill="none" stroke="#FF4D8D" strokeWidth="2" />
      <path d="M270 80 q12 -10 24 0" fill="none" stroke="#4A90E2" strokeWidth="2" />
    </Frame>
  );
}

export function BalloonBunch() {
  return (
    <Frame bg="#E8F4FF">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Hooray for you!
      </text>
      <g transform="translate(170,140)">
        <ellipse cx="-30" cy="-20" rx="22" ry="28" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="2.6" />
        <ellipse cx="20" cy="-30" rx="22" ry="28" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2.6" />
        <ellipse cx="50" cy="0" rx="22" ry="28" fill="#6FCF97" stroke="#1a1a1a" strokeWidth="2.6" />
        <path d="M-30 8 q-4 30 -10 60" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
        <path d="M20 -2 q4 30 0 70" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
        <path d="M50 28 q-2 24 -16 40" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
        <path d="M-35 -22 q4 -2 0 -10" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="1.4" />
      </g>
    </Frame>
  );
}

export function PartyHatDog() {
  return (
    <Frame bg="#FFF8E1">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Many happy returns!
      </text>
      <g transform="translate(160,160)">
        <ellipse cx="0" cy="20" rx="58" ry="34" fill="#F6C667" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse cx="0" cy="-12" rx="42" ry="36" fill="#F6C667" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse cx="-32" cy="-10" rx="14" ry="22" fill="#FF8A3C" stroke="#1a1a1a" strokeWidth="2.5" />
        <ellipse cx="32" cy="-10" rx="14" ry="22" fill="#FF8A3C" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle cx="-12" cy="-12" r="3" fill="#1a1a1a" />
        <circle cx="12" cy="-12" r="3" fill="#1a1a1a" />
        <ellipse cx="0" cy="2" rx="6" ry="4" fill="#1a1a1a" />
        <path d="M-8 8 q8 8 16 0" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M-20 -38 L0 -76 L20 -38 Z" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle cx="0" cy="-78" r="4" fill="#F6C667" stroke="#1a1a1a" strokeWidth="1.6" />
      </g>
    </Frame>
  );
}

export function PresentStack() {
  return (
    <Frame bg="#F4ECFF">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        A pile of good things.
      </text>
      <g transform="translate(160,180)">
        <rect x="-60" y="-30" width="120" height="40" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="-30" x2="0" y2="10" stroke="#F6C667" strokeWidth="4" />
        <line x1="-60" y1="-10" x2="60" y2="-10" stroke="#F6C667" strokeWidth="4" />
        <rect x="-40" y="-70" width="80" height="40" fill="#4A90E2" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="-70" x2="0" y2="-30" stroke="#FBF7F0" strokeWidth="4" />
        <line x1="-40" y1="-50" x2="40" y2="-50" stroke="#FBF7F0" strokeWidth="4" />
        <path d="M-12 -76 q-8 -16 0 -20 q12 -2 12 12 q0 -14 12 -12 q8 4 0 20" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2" />
      </g>
    </Frame>
  );
}

// ── LOVE ───────────────────────────────────────────────────────────────────

export function HeartLetter() {
  return (
    <Frame bg="#FFE5EE">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        With all the love.
      </text>
      <g transform="translate(160,150)">
        <rect x="-70" y="-40" width="140" height="80" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-70 -40 L0 10 L70 -40" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-30 -8 c-12 -10 -12 -22 -2 -22 c6 0 10 6 10 10 c0 -4 4 -10 10 -10 c10 0 10 12 -2 22 c-6 6 -10 8 -16 8 z" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="2" />
      </g>
    </Frame>
  );
}

export function PenguinHugs() {
  return (
    <Frame bg="#E8F4FF">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Stuck on you.
      </text>
      <g transform="translate(120,160)">
        <ellipse cx="0" cy="0" rx="32" ry="44" fill="#1a1a1a" />
        <ellipse cx="0" cy="6" rx="20" ry="30" fill="#FBF7F0" />
        <path d="M-6 -22 l6 8 l6 -8 z" fill="#FF8A3C" stroke="#1a1a1a" strokeWidth="1.4" />
        <circle cx="-6" cy="-26" r="2.5" fill="#1a1a1a" />
        <circle cx="6" cy="-26" r="2.5" fill="#1a1a1a" />
        <ellipse cx="-22" cy="38" rx="10" ry="4" fill="#FF8A3C" stroke="#1a1a1a" strokeWidth="1.4" />
        <ellipse cx="22" cy="38" rx="10" ry="4" fill="#FF8A3C" stroke="#1a1a1a" strokeWidth="1.4" />
      </g>
      <g transform="translate(200,160)">
        <ellipse cx="0" cy="0" rx="32" ry="44" fill="#1a1a1a" />
        <ellipse cx="0" cy="6" rx="20" ry="30" fill="#FBF7F0" />
        <path d="M-6 -22 l6 8 l6 -8 z" fill="#FF8A3C" stroke="#1a1a1a" strokeWidth="1.4" />
        <circle cx="-6" cy="-26" r="2.5" fill="#1a1a1a" />
        <circle cx="6" cy="-26" r="2.5" fill="#1a1a1a" />
      </g>
      <path d="M152 130 c-6 -8 0 -16 6 -12 c2 -6 10 -2 8 6 c-2 6 -8 10 -14 6 z" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="1.4" />
    </Frame>
  );
}

// ── FRIENDSHIP ─────────────────────────────────────────────────────────────

export function UmbrellaShare() {
  return (
    <Frame bg="#E8F4FF">
      <text x="20" y="40" fontFamily="Caveat" fontSize="26" fill="#1a1a1a">
        Two of us, one umbrella.
      </text>
      <g transform="translate(160,170)">
        <path d="M-90 -30 q90 -90 180 0 z" fill="#6FCF97" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-90 -30 q90 -10 180 0" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="0" y1="-30" x2="0" y2="40" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M0 40 q10 6 0 14" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="-30" cy="20" r="14" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="30" cy="20" r="14" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="-110" y1="-10" x2="-100" y2="20" stroke="#4A90E2" strokeWidth="2" />
        <line x1="110" y1="-10" x2="100" y2="20" stroke="#4A90E2" strokeWidth="2" />
        <line x1="-60" y1="-50" x2="-50" y2="-20" stroke="#4A90E2" strokeWidth="2" />
        <line x1="60" y1="-50" x2="50" y2="-20" stroke="#4A90E2" strokeWidth="2" />
      </g>
    </Frame>
  );
}

export function BenchTwoBirds() {
  return (
    <Frame bg="#FFF8E1">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Same bench, always.
      </text>
      <g transform="translate(160,170)">
        <rect x="-100" y="0" width="200" height="14" fill="#B8A6E0" stroke="#1a1a1a" strokeWidth="2.5" />
        <line x1="-90" y1="14" x2="-90" y2="40" stroke="#1a1a1a" strokeWidth="2.5" />
        <line x1="90" y1="14" x2="90" y2="40" stroke="#1a1a1a" strokeWidth="2.5" />
        <rect x="-100" y="-30" width="200" height="14" fill="#B8A6E0" stroke="#1a1a1a" strokeWidth="2.5" />
        <g transform="translate(-30,-50)">
          <ellipse cx="0" cy="0" rx="14" ry="11" fill="#FF8A3C" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="-4" cy="-2" r="1.6" fill="#1a1a1a" />
          <path d="M8 -2 l8 2 l-8 2 z" fill="#F6C667" stroke="#1a1a1a" strokeWidth="1.4" />
        </g>
        <g transform="translate(30,-50)">
          <ellipse cx="0" cy="0" rx="14" ry="11" fill="#4A90E2" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="4" cy="-2" r="1.6" fill="#1a1a1a" />
          <path d="M-8 -2 l-8 2 l8 2 z" fill="#F6C667" stroke="#1a1a1a" strokeWidth="1.4" />
        </g>
      </g>
    </Frame>
  );
}

// ── PUNS ───────────────────────────────────────────────────────────────────

export function NotKidding() {
  return (
    <Frame bg="#FFF1F5">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        I'm not kidding.
      </text>
      <g transform="translate(160,160)">
        <ellipse cx="0" cy="0" rx="58" ry="50" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-30 -50 l-6 -16" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M30 -50 l6 -16" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse cx="-30" cy="-20" rx="14" ry="20" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="2.5" />
        <ellipse cx="30" cy="-20" rx="14" ry="20" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle cx="-12" cy="-2" r="3" fill="#1a1a1a" />
        <circle cx="12" cy="-2" r="3" fill="#1a1a1a" />
        <ellipse cx="0" cy="14" rx="6" ry="4" fill="#1a1a1a" />
        <path d="M-12 24 q12 8 24 0" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        <text x="-30" y="-30" fontFamily="Caveat" fontSize="16" fill="#1a1a1a">baa.</text>
      </g>
    </Frame>
  );
}

export function OllieOctopus() {
  return (
    <Frame bg="#E8F4FF">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        I'd hug you with all eight.
      </text>
      <g transform="translate(160,160)">
        <ellipse cx="0" cy="-10" rx="48" ry="40" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-40 10 q-10 40 -28 30" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-25 18 q-6 50 -16 40" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-10 22 q-2 50 -8 50" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M5 22 q4 50 -2 56" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M20 18 q14 46 4 56" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M32 14 q22 38 12 50" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M40 8 q28 32 22 44" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M44 0 q34 26 30 38" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="-12" cy="-14" r="3" fill="#1a1a1a" />
        <circle cx="12" cy="-14" r="3" fill="#1a1a1a" />
        <path d="M-8 -2 q8 6 16 0" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      </g>
    </Frame>
  );
}

// ── CUSTOM ─────────────────────────────────────────────────────────────────

export function ToastingGlass() {
  return (
    <Frame bg="#FFF8E1">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        A toast to you.
      </text>
      <g transform="translate(160,160)">
        <path d="M-32 -30 L-22 30 L22 30 L32 -30 Z" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M-30 -20 q30 16 60 0" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="0" y1="30" x2="0" y2="60" stroke="#1a1a1a" strokeWidth="3" />
        <ellipse cx="0" cy="62" rx="22" ry="6" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <circle cx="-20" cy="-18" r="3" fill="#FF8A3C" />
        <circle cx="-8" cy="-22" r="3" fill="#FF8A3C" />
        <circle cx="8" cy="-20" r="3" fill="#FF8A3C" />
        <circle cx="20" cy="-18" r="3" fill="#FF8A3C" />
        <text x="-60" y="-46" fontFamily="Caveat" fontSize="20" fill="#1a1a1a">cheers!</text>
      </g>
    </Frame>
  );
}

export function ThankYouLetter() {
  return (
    <Frame bg="#F4ECFF">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Thank you, truly.
      </text>
      <g transform="translate(160,150)">
        <rect x="-70" y="-40" width="140" height="90" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="3" rx="2" />
        <line x1="-50" y1="-20" x2="50" y2="-20" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="-50" y1="-6" x2="40" y2="-6" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="-50" y1="8" x2="50" y2="8" stroke="#1a1a1a" strokeWidth="1.4" />
        <line x1="-50" y1="22" x2="20" y2="22" stroke="#1a1a1a" strokeWidth="1.4" />
        <path d="M40 30 c-6 -6 -6 -16 2 -16 c4 0 6 4 6 6 c0 -2 2 -6 6 -6 c8 0 8 10 2 16 c-4 4 -8 6 -10 6 z" fill="#FF4D8D" stroke="#1a1a1a" strokeWidth="1.4" />
      </g>
    </Frame>
  );
}

export function GoodLuckClover() {
  return (
    <Frame bg="#E8FFE8">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Rooting for you.
      </text>
      <g transform="translate(160,160)">
        <path d="M0 -10 c-20 -30 -50 -10 -30 14 c-30 0 -30 30 0 36 c-10 24 24 30 30 6 c6 24 40 18 30 -6 c30 -6 30 -36 0 -36 c20 -24 -10 -44 -30 -14 z" fill="#6FCF97" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="40" x2="0" y2="80" stroke="#1a1a1a" strokeWidth="3" />
      </g>
    </Frame>
  );
}

export function SympathyCandle() {
  return (
    <Frame bg="#F0EAE0">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#1a1a1a">
        Holding you in our hearts.
      </text>
      <g transform="translate(160,170)">
        <rect x="-22" y="-10" width="44" height="60" fill="#FBF7F0" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="0" y1="-10" x2="0" y2="-30" stroke="#1a1a1a" strokeWidth="2.4" />
        <path d="M-7 -30 q3 -22 7 -22 q4 0 7 22 q-7 8 -14 0 z" fill="#F6C667" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M-22 -10 q22 -8 44 0" fill="none" stroke="#1a1a1a" strokeWidth="1.6" />
      </g>
      <path d="M50 90 q10 -4 20 0" fill="none" stroke="#B8A6E0" strokeWidth="2" />
      <path d="M250 100 q10 -4 20 0" fill="none" stroke="#B8A6E0" strokeWidth="2" />
    </Frame>
  );
}

export function StarryWish() {
  return (
    <Frame bg="#1a1a1a">
      <text x="20" y="40" fontFamily="Caveat" fontSize="28" fill="#FBF7F0">
        Wishing you the world.
      </text>
      <g stroke="#F6C667" strokeWidth="2" fill="#F6C667">
        <circle cx="60" cy="100" r="2" />
        <circle cx="100" cy="160" r="1.6" />
        <circle cx="220" cy="80" r="1.6" />
        <circle cx="270" cy="140" r="2" />
        <circle cx="180" cy="200" r="1.6" />
      </g>
      <g transform="translate(160,160)">
        <path d="M0 -36 L8 -10 L36 -8 L14 8 L22 36 L0 18 L-22 36 L-14 8 L-36 -8 L-8 -10 Z" fill="#F6C667" stroke="#FBF7F0" strokeWidth="1.4" />
      </g>
    </Frame>
  );
}
