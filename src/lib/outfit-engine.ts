import { products } from "@/data/products";
import { quizQuestions, type QuizAnswers } from "@/data/style-quiz";
import type { Product } from "@/types";

export interface OutfitItem {
  slot: "Shoes" | "Top" | "Bottom" | "Accessory";
  product: Product;
  matchedTags: string[];
}

export interface OutfitResult {
  items: OutfitItem[];
  styleLabel: string;
  occasionLabel: string;
}

const slotDefs: { slot: OutfitItem["slot"]; test: (p: Product) => boolean; required: boolean }[] = [
  { slot: "Shoes", test: (p) => p.productCategory === "shoes", required: true },
  { slot: "Top", test: (p) => ["tee", "hoodie", "jacket", "cardigan"].includes(p.type), required: true },
  { slot: "Bottom", test: (p) => p.type === "pant", required: false },
  { slot: "Accessory", test: (p) => ["bag", "beanie", "cap", "sock"].includes(p.type), required: false },
];

function genderMatches(product: Product, gender: string): boolean {
  if (gender === "any") return true;
  return product.category === gender || product.category === "unisex";
}

function scoreProduct(product: Product, wantedTags: string[]): { score: number; matched: string[] } {
  const matched = product.tags.filter((tag) => wantedTags.includes(tag));
  let score = matched.length;
  score += product.rating / 5;
  if (product.badge === "bestseller") score += 0.3;
  return { score, matched };
}

export function generateOutfit(answers: QuizAnswers): OutfitResult {
  const styleOpt = quizQuestions
    .find((q) => q.id === "style")!
    .options.find((o) => o.value === answers.style);
  const occasionOpt = quizQuestions
    .find((q) => q.id === "occasion")!
    .options.find((o) => o.value === answers.occasion);
  const budgetOpt = quizQuestions
    .find((q) => q.id === "budget")!
    .options.find((o) => o.value === answers.budget);

  const wantedTags = [...(styleOpt?.tags ?? []), ...(occasionOpt?.tags ?? [])];
  const maxPrice = budgetOpt?.maxPrice ?? Infinity;
  const gender = answers.gender ?? "any";

  const items: OutfitItem[] = [];

  for (const { slot, test, required } of slotDefs) {
    let candidates = products.filter(
      (p) => test(p) && genderMatches(p, gender) && p.price <= maxPrice
    );
    if (candidates.length === 0) {
      candidates = products.filter((p) => test(p) && genderMatches(p, gender));
    }
    if (candidates.length === 0) continue;

    const scored = candidates
      .map((p) => ({ product: p, ...scoreProduct(p, wantedTags) }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (!required && best.score < 1) continue;

    items.push({ slot, product: best.product, matchedTags: best.matched });
  }

  return {
    items,
    styleLabel: styleOpt?.label ?? "Your style",
    occasionLabel: occasionOpt?.label ?? "",
  };
}
