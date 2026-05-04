import { ComponentType } from "react";
import { BestTea } from "../sketches/BestTea";
import { PhoneCallDuo } from "../sketches/PhoneCallDuo";
import { EggstraHappy } from "../sketches/EggstraHappy";
import { GotYourBack } from "../sketches/GotYourBack";
import {
  BeeMine,
  PawsitiveVibes,
  YouRock,
  DonutWorry,
  BerrySpecial,
  SunSational,
} from "../sketches/PunSketches";

export type Category = "Birthday" | "Love" | "Friendship" | "Puns" | "Custom";

export type Sketch = {
  id: string;
  title: string;
  pun: string;
  /** Path to a real photo in /public/sketches/ — if present, takes priority over Component. */
  image?: string;
  Component?: ComponentType;
  price: number;
  category: Category;
  /** dominant accent color (used for hover glow) */
  accent: string;
};

export const sketches: Sketch[] = [
  {
    id: "best-tea",
    title: "Best-tea",
    pun: "For your number-one bestie.",
    Component: BestTea,
    image: "/sketches/best-tea.jpg",
    price: 12,
    category: "Birthday",
    accent: "#FF8A3C",
  },
  {
    id: "happy-bday-girl",
    title: "Happy Birthday Girl",
    pun: "Long-distance? Heart-string-close.",
    Component: PhoneCallDuo,
    image: "/sketches/happy-birthday-girl.jpg",
    price: 12,
    category: "Friendship",
    accent: "#FF4D8D",
  },
  {
    id: "eggstra-happy",
    title: "Egg-stra Happy",
    pun: "You make my life egg-stra.",
    Component: EggstraHappy,
    image: "/sketches/eggstra-happy.jpg",
    price: 12,
    category: "Love",
    accent: "#4A90E2",
  },
  {
    id: "got-your-back",
    title: "I Got Your Back",
    pun: "Literally, see?",
    Component: GotYourBack,
    image: "/sketches/got-your-back.jpg",
    price: 12,
    category: "Friendship",
    accent: "#FF4D8D",
  },
  {
    id: "bee-mine",
    title: "Bee Mine",
    pun: "Buzz-worthy crush vibes.",
    Component: BeeMine,
    price: 10,
    category: "Love",
    accent: "#F6C667",
  },
  {
    id: "pawsitive-vibes",
    title: "Pawsitive Vibes",
    pun: "For the pet-parent in your life.",
    Component: PawsitiveVibes,
    price: 10,
    category: "Friendship",
    accent: "#4A90E2",
  },
  {
    id: "you-rock",
    title: "You Rock",
    pun: "Geologically speaking.",
    Component: YouRock,
    price: 10,
    category: "Puns",
    accent: "#B8A6E0",
  },
  {
    id: "donut-worry",
    title: "Donut Worry",
    pun: "Be happy. Eat sprinkles.",
    Component: DonutWorry,
    price: 10,
    category: "Puns",
    accent: "#FFC0D9",
  },
  {
    id: "berry-special",
    title: "Berry Special",
    pun: "For someone strawb-incredible.",
    Component: BerrySpecial,
    price: 10,
    category: "Love",
    accent: "#FF4D8D",
  },
  {
    id: "sun-sational",
    title: "Sun-sational",
    pun: "Brighter than your Monday.",
    Component: SunSational,
    price: 10,
    category: "Puns",
    accent: "#FF8A3C",
  },
];

export const categories: Category[] = [
  "Birthday",
  "Love",
  "Friendship",
  "Puns",
  "Custom",
];
