import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Rohan Sharma',
      role: 'Competitive Bodybuilder & Coach',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      comment: 'The PV ISO-Gold is unmatched in mixability and purity. I have verified every single tub using the PV Verify authenticity code. Zero bloating, real results.',
      rating: 5,
      product: 'PV ISO-Gold 100% Whey Isolate',
    },
    {
      name: 'Pooja Nair',
      role: 'CrossFit Athlete & Nutritionist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      comment: 'I recommend Protein Villa to all my gym clients. The Protein Goal and TDEE Calculators make nutrition planning effortless, and orders reach within 48 hours.',
      rating: 5,
      product: 'PV Creapure & Opti-Men Stack',
    },
    {
      name: 'Vikram Rajput',
      role: 'Powerlifter (National Medallist)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      comment: 'Creapure Micronized Creatine gave me an immediate +15kg boost on my deadlift in 6 weeks. 100% genuine supplements, authentic packaging, best customer support.',
      rating: 5,
      product: 'PV Creapure Micronized Creatine',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-[#0a0d12] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            Real Athletes • Real Results
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            What Fitness Champions Say
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Over 50,000+ verified orders delivered across 250+ Indian cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-dark-surface p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-md flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-500/30" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center gap-3.5">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-brand-500/40"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {r.name}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {r.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
