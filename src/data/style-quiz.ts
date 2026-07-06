export type QuizGender = "women" | "men" | "any";

export interface QuizOption {
  value: string;
  label: string;
  tags?: string[];
  maxPrice?: number;
}

export interface QuizQuestion {
  id: "gender" | "style" | "occasion" | "budget";
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "gender",
    question: "Who are we styling today?",
    options: [
      { value: "women", label: "Her" },
      { value: "men", label: "Him" },
      { value: "any", label: "No preference" },
    ],
  },
  {
    id: "style",
    question: "Which style feels most like you?",
    options: [
      { value: "casual", label: "Casual & easygoing", tags: ["casual", "everyday", "comfortable"] },
      { value: "streetwear", label: "Streetwear", tags: ["streetwear", "bold", "oversized"] },
      { value: "smart-casual", label: "Smart-casual", tags: ["smart-casual", "elegant", "office"] },
      { value: "classic", label: "Classic & minimal", tags: ["classic", "minimal", "versatile"] },
      { value: "sporty", label: "Sporty & active", tags: ["performance", "running", "breathable"] },
    ],
  },
  {
    id: "occasion",
    question: "What's the occasion?",
    options: [
      { value: "everyday", label: "Everyday errands", tags: ["everyday", "casual"] },
      { value: "office", label: "Office / work", tags: ["office", "smart-casual"] },
      { value: "night-out", label: "Night out", tags: ["elegant", "bold"] },
      { value: "workout", label: "Workout", tags: ["performance", "running", "breathable"] },
      { value: "travel", label: "Travel / outdoors", tags: ["trail-ready", "durable", "warm"] },
    ],
  },
  {
    id: "budget",
    question: "What's your budget per item?",
    options: [
      { value: "budget", label: "Up to 300 zl", maxPrice: 300 },
      { value: "mid", label: "300 - 600 zl", maxPrice: 600 },
      { value: "premium", label: "No limit", maxPrice: Infinity },
    ],
  },
];

export type QuizAnswers = Partial<Record<QuizQuestion["id"], string>>;
