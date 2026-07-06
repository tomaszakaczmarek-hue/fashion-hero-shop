import type { Metadata } from "next";
import { StyleWizard } from "@/components/style-wizard/style-wizard";

export const metadata: Metadata = {
  title: "Style Wizard - FashionHero",
  description: "Answer a few questions and get a personalized outfit recommendation.",
};

export default function StyleWizardPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <StyleWizard />
    </div>
  );
}
