// Daily wellness tips generator based on wedding phase

type Phase = 'reset' | 'build' | 'refine' | 'maintain';

interface TipContext {
  phase: Phase;
  daysUntil: number;
  userName?: string;
}

interface DailyTip {
  title: string;
  body: string;
  url: string;
}

const tips = {
  reset: [
    {
      title: "Start Your Morning Right ☀️",
      body: "Drink a glass of warm water with lemon to kickstart your metabolism and flush toxins.",
      url: "/resources?tip=morning-routine"
    },
    {
      title: "Double Cleanse Tonight 🧼",
      body: "Remove makeup and sunscreen thoroughly. Use an oil-based cleanser first, then a gentle face wash.",
      url: "/resources?tip=double-cleanse"
    },
    {
      title: "Sleep is Your Secret Weapon 😴",
      body: "Aim for 7-8 hours tonight. Your skin repairs itself while you sleep - it's free skincare!",
      url: "/resources?tip=sleep"
    },
    {
      title: "Cut the Sugar Today 🚫🍭",
      body: "Sugar causes inflammation and breakouts. Swap dessert for fresh fruit - your skin will thank you.",
      url: "/resources?tip=nutrition"
    },
    {
      title: "Hydration Check 💧",
      body: "Drink at least 8 glasses of water today. Set reminders if needed - hydrated skin glows naturally.",
      url: "/resources?tip=hydration"
    },
  ],
  build: [
    {
      title: "Add Vitamin C Today ✨",
      body: "A Vitamin C serum in the morning brightens skin and protects against damage. Perfect for building that glow!",
      url: "/resources?tip=vitamin-c"
    },
    {
      title: "Strength Training Time 💪",
      body: "30 minutes of weight training today. Focus on arms and shoulders - they'll look amazing in your outfit!",
      url: "/resources?tip=workout"
    },
    {
      title: "Professional Facial Time 🧖‍♀️",
      body: "Book a deep cleansing facial this week. Your skin is ready for advanced treatments in the Build phase.",
      url: "/resources?tip=treatments"
    },
    {
      title: "Protein Power 🥚",
      body: "Get 20-30g of protein at breakfast. Eggs, Greek yogurt, or protein smoothie - builds healthy skin and muscles.",
      url: "/resources?tip=protein"
    },
    {
      title: "Exfoliate Gently 🌟",
      body: "Use a chemical exfoliant (AHA/BHA) 2-3x this week. Smooth skin = flawless makeup application later!",
      url: "/resources?tip=exfoliation"
    },
  ],
  refine: [
    {
      title: "Makeup Trial Today? 💄",
      body: "Book your makeup trial if you haven't! Take photos in natural light and test how it lasts all day.",
      url: "/resources?tip=makeup-trial"
    },
    {
      title: "No New Products Now! ⚠️",
      body: "Stick to what's working. This close to your wedding, trying new skincare can cause unexpected reactions.",
      url: "/resources?tip=safe-products"
    },
    {
      title: "Hair Trial Check ✂️",
      body: "Schedule your hair trial soon. Bring reference photos and test accessories to see what works.",
      url: "/resources?tip=hair"
    },
    {
      title: "Final Body Toning 🏃‍♀️",
      body: "Focus on definition, not weight loss. Light weights, high reps. You're perfecting, not changing.",
      url: "/resources?tip=toning"
    },
    {
      title: "Professional Cleanup 💅",
      body: "Get eyebrows threaded, upper lip done. Schedule 3 days before wedding so any redness fades.",
      url: "/resources?tip=grooming"
    },
  ],
  maintain: [
    {
      title: "Gentle Everything Now 🌸",
      body: "No harsh treatments. Just cleanse, moisturize, protect. Let your work shine through!",
      url: "/resources?tip=gentle-routine"
    },
    {
      title: "Hydration on Repeat 💦",
      body: "Water, water, water! Carry a bottle everywhere. Hydrated skin photographs beautifully.",
      url: "/resources?tip=hydration"
    },
    {
      title: "Sleep > Everything 😴",
      body: "Prioritize rest this week. Dark circles and puffiness are not wedding-day ready!",
      url: "/resources?tip=rest"
    },
    {
      title: "No Experiments! 🚫",
      body: "Don't try new food, new products, or new workouts. Maintain what's working perfectly.",
      url: "/resources?tip=maintain"
    },
    {
      title: "Stress Management 🧘‍♀️",
      body: "Take 10 minutes to breathe deeply. Stress shows on your face - calm mind, glowing skin.",
      url: "/resources?tip=stress"
    },
  ],
};

export function getPhase(daysUntil: number): Phase {
  if (daysUntil > 120) return 'reset';
  if (daysUntil > 60) return 'build';
  if (daysUntil > 30) return 'refine';
  return 'maintain';
}

export function generateDailyTip(context: TipContext): DailyTip {
  const phaseTips = tips[context.phase];
  
  // Use day count to deterministically pick a tip (so same day = same tip)
  const tipIndex = context.daysUntil % phaseTips.length;
  const baseTip = phaseTips[tipIndex];
  
  // Personalize the title if we have a name
  const title = context.userName 
    ? `${context.userName}, Day ${context.daysUntil}: ${baseTip.title}`
    : `Day ${context.daysUntil}: ${baseTip.title}`;
  
  return {
    title,
    body: baseTip.body,
    url: baseTip.url,
  };
}

// Get tip directly from days until wedding
export function getTipForDaysUntil(daysUntil: number, userName?: string): DailyTip {
  const phase = getPhase(daysUntil);
  return generateDailyTip({ phase, daysUntil, userName });
}
