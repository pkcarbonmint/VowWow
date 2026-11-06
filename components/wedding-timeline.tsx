"use client";

import { useEffect, useState } from "react";

interface Phase {
  name: string;
  emoji: string;
  description: string;
  timeline: string;
  keyFocus: string[];
  color: string;
}

const phases: Phase[] = [
  {
    name: "Reset",
    emoji: "🔄",
    description: "Detox, reset habits, and establish a strong foundation",
    timeline: "6-4 months before",
    keyFocus: [
      "Clean eating and hydration",
      "Basic skincare routine",
      "Sleep optimization",
      "Stress management"
    ],
    color: "bg-blue-50 border-blue-200"
  },
  {
    name: "Build",
    emoji: "💪",
    description: "Build strength, healthy habits, and glowing skin",
    timeline: "4-2 months before",
    keyFocus: [
      "Consistent workout routine",
      "Advanced skincare treatments",
      "Nutrition optimization",
      "Body toning"
    ],
    color: "bg-green-50 border-green-200"
  },
  {
    name: "Refine",
    emoji: "✨",
    description: "Fine-tune everything and maximize your glow",
    timeline: "2-1 months before",
    keyFocus: [
      "Professional treatments",
      "Makeup and hair trials",
      "Final body sculpting",
      "Skin perfection"
    ],
    color: "bg-purple-50 border-purple-200"
  },
  {
    name: "Maintain",
    emoji: "🌟",
    description: "Protect your results and stay camera-ready",
    timeline: "Final month",
    keyFocus: [
      "Gentle maintenance",
      "No experimental treatments",
      "Hydration and rest",
      "Stress-free routine"
    ],
    color: "bg-pink-50 border-pink-200"
  }
];

export function WeddingTimeline() {
  const [weddingDate, setWeddingDate] = useState<string>("");
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);

  useEffect(() => {
    // Try to get wedding date from localStorage (from signup form)
    const draft = localStorage.getItem('ww:draft');
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (data.weddingMonth) {
          setWeddingDate(data.weddingMonth);
          calculateDaysRemaining(data.weddingMonth);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const calculateDaysRemaining = (date: string) => {
    const wedding = new Date(date);
    const today = new Date();
    const diff = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysRemaining(diff);

    // Determine current phase
    if (diff > 120) {
      setCurrentPhase(phases[0]); // Reset
    } else if (diff > 60) {
      setCurrentPhase(phases[1]); // Build
    } else if (diff > 30) {
      setCurrentPhase(phases[2]); // Refine
    } else {
      setCurrentPhase(phases[3]); // Maintain
    }
  };

  return (
    <div className="space-y-8">
      {/* Countdown Banner */}
      {daysRemaining !== null && currentPhase && (
        <div className="rounded-3xl border border-line bg-gradient-to-r from-sage/10 to-sand/50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Your Wedding Countdown
          </p>
          <p className="mt-2 font-serif text-5xl font-bold text-ink">
            {daysRemaining} Days
          </p>
          <p className="mt-4 text-lg font-semibold text-sage">
            <span className="mr-2">{currentPhase.emoji}</span>
            Currently in: {currentPhase.name} Phase
          </p>
        </div>
      )}

      {/* Phase Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {phases.map((phase, index) => (
          <div
            key={phase.name}
            className={`rounded-3xl border-2 p-6 transition-all ${
              currentPhase?.name === phase.name
                ? 'border-sage bg-sage/5 shadow-lg'
                : 'border-line bg-white hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{phase.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-ink">
                      Phase {index + 1}: {phase.name}
                    </h3>
                    <p className="text-sm text-muted">{phase.timeline}</p>
                  </div>
                </div>
              </div>
              {currentPhase?.name === phase.name && (
                <span className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-white">
                  Current
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-muted">{phase.description}</p>

            <div className="mt-4">
              <p className="text-sm font-semibold text-ink">Key Focus Areas:</p>
              <ul className="mt-2 space-y-2">
                {phase.keyFocus.map((focus) => (
                  <li key={focus} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-sage">✓</span>
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="rounded-3xl border border-line bg-white p-6">
        <h3 className="font-semibold text-ink">💡 Timeline Tips</h3>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li className="flex gap-3">
            <span>•</span>
            <span>These phases are flexible - adjust based on your starting point and wedding date</span>
          </li>
          <li className="flex gap-3">
            <span>•</span>
            <span>Start wherever you are now - it's never too late to begin</span>
          </li>
          <li className="flex gap-3">
            <span>•</span>
            <span>Stop experimental treatments 2 weeks before your wedding</span>
          </li>
          <li className="flex gap-3">
            <span>•</span>
            <span>Focus on consistency over perfection</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
