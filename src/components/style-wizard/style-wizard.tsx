"use client";

import { useState } from "react";
import { quizQuestions, type QuizAnswers } from "@/data/style-quiz";
import { generateOutfit, type OutfitResult } from "@/lib/outfit-engine";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { SparklesIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function StyleWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [result, setResult] = useState<OutfitResult | null>(null);
  const { addItem } = useCart();

  const isResult = step >= quizQuestions.length;
  const currentQuestion = quizQuestions[step];

  function selectOption(value: string) {
    const nextAnswers: QuizAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    const nextStep = step + 1;
    if (nextStep >= quizQuestions.length) {
      setResult(generateOutfit(nextAnswers));
    }
    setStep(nextStep);
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setStep(0);
  }

  function addLookToCart() {
    if (!result) return;
    for (const item of result.items) {
      const color = item.product.colors[0];
      const size = item.product.sizes[Math.floor(item.product.sizes.length / 2)];
      addItem(item.product, color, size);
    }
  }

  if (isResult && result) {
    const total = result.items.reduce((sum, item) => sum + item.product.price, 0);

    return (
      <div>
        <div className="flex items-center justify-center gap-2 mb-3 text-warm-gray">
          <SparklesIcon className="h-4 w-4" />
          <p className="text-[11px] font-medium uppercase tracking-[0.8px]">Your look</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-normal text-charcoal text-center mb-2">
          {result.styleLabel}
        </h1>
        <p className="text-sm text-warm-gray text-center mb-10">
          {result.items.length > 0
            ? `${result.items.length} pieces picked for you - ${total} zl total`
            : "We couldn't find a match - try different answers."}
        </p>

        {result.items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {result.items.map((item) => (
              <div key={item.product.id}>
                <p className="text-[11px] font-medium uppercase tracking-[0.8px] text-warm-gray mb-2">
                  {item.slot}
                </p>
                <ProductCard product={item.product} />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {result.items.length > 0 && (
            <button
              onClick={addLookToCart}
              className="inline-flex items-center justify-center px-6 py-3 text-[11px] font-medium uppercase tracking-[0.6px] text-white bg-charcoal rounded-full hover:opacity-80 transition-opacity"
            >
              Add look to cart
            </button>
          )}
          <button
            onClick={restart}
            className="inline-flex items-center justify-center px-6 py-3 text-[11px] font-medium uppercase tracking-[0.6px] text-charcoal border border-charcoal rounded-full hover:bg-charcoal hover:text-white transition-all"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-8">
        {quizQuestions.map((q, i) => (
          <span
            key={q.id}
            className={cn(
              "h-1 w-10 rounded-full transition-colors",
              i <= step ? "bg-charcoal" : "bg-black/10"
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mb-2 text-warm-gray">
        <SparklesIcon className="h-4 w-4" />
        <p className="text-[11px] font-medium uppercase tracking-[0.8px]">
          Step {step + 1} of {quizQuestions.length}
        </p>
      </div>
      <h1 className="text-2xl md:text-3xl font-normal text-charcoal text-center mb-10">
        {currentQuestion.question}
      </h1>

      <div className="flex flex-col gap-3 max-w-md mx-auto">
        {currentQuestion.options.map((option) => (
          <button
            key={option.value}
            onClick={() => selectOption(option.value)}
            className="text-left px-5 py-4 border border-black/15 rounded-lg hover:border-charcoal transition-colors text-sm font-medium text-charcoal"
          >
            {option.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setStep(step - 1)}
            className="text-[12px] text-warm-gray underline hover:text-charcoal transition-colors"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
