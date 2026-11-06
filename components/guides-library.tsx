"use client";

const categories = [
  {
    name: "Skincare",
    emoji: "✨",
    guides: [
      { title: "Double Cleansing 101", duration: "5 min", status: "Coming Soon" },
      { title: "Bridal Skincare Timeline", duration: "10 min", status: "Coming Soon" },
      { title: "Dealing with Breakouts", duration: "7 min", status: "Coming Soon" },
    ],
  },
  {
    name: "Fitness",
    emoji: "💪",
    guides: [
      { title: "4-Month Wedding Workout Plan", duration: "15 min", status: "Coming Soon" },
      { title: "Quick Daily Exercises", duration: "8 min", status: "Coming Soon" },
      { title: "Toning for Photos", duration: "12 min", status: "Coming Soon" },
    ],
  },
  {
    name: "Nutrition",
    emoji: "🥗",
    guides: [
      { title: "Pre-Wedding Meal Plans", duration: "12 min", status: "Coming Soon" },
      { title: "Foods for Glowing Skin", duration: "6 min", status: "Coming Soon" },
      { title: "Hydration Guide", duration: "5 min", status: "Coming Soon" },
    ],
  },
  {
    name: "Beauty",
    emoji: "💄",
    guides: [
      { title: "Makeup Trial Preparation", duration: "8 min", status: "Coming Soon" },
      { title: "Hair Care Routine", duration: "10 min", status: "Coming Soon" },
      { title: "Mehendi Aftercare", duration: "6 min", status: "Coming Soon" },
    ],
  },
];

export function GuidesLibrary() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-line bg-white p-6">
        <h2 className="text-2xl font-bold text-ink">Video Guides & Resources</h2>
        <p className="mt-2 text-muted">
          Expert advice and tutorials to support your wedding wellness journey
        </p>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category.name} className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-ink">
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </h3>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.guides.map((guide) => (
              <div
                key={guide.title}
                className="rounded-2xl border border-line bg-white p-4 transition-all hover:shadow-md"
              >
                {/* Placeholder thumbnail */}
                <div className="aspect-video rounded-lg bg-gradient-to-br from-sage/20 to-sand/50 flex items-center justify-center">
                  <span className="text-4xl">{category.emoji}</span>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold text-ink">{guide.title}</h4>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted">{guide.duration}</span>
                    <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-muted">
                      {guide.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Info Banner */}
      <div className="rounded-3xl border border-sage/30 bg-sage/5 p-6 text-center">
        <p className="text-4xl">🎬</p>
        <p className="mt-4 font-semibold text-ink">More content coming soon!</p>
        <p className="mt-2 text-sm text-muted">
          We're creating comprehensive video guides to help you on your wedding wellness journey.
          Check back soon or enable notifications to be notified when new guides are available.
        </p>
      </div>
    </div>
  );
}
