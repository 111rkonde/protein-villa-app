import React from 'react';
import { ShieldCheck, Award, Zap, Truck, CheckCircle2, Lock } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-500" />,
      title: '100% Authentic Products',
      description: 'Zero counterfeits. Sourced directly from authorized manufacturers with tamper-proof holographic seals and verifiable batch numbers.',
    },
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      title: '3rd-Party HPLC Lab Certified',
      description: 'Every single batch is independently tested by NABL-accredited labs for accurate protein concentration and zero heavy metal contamination.',
    },
    {
      icon: <Truck className="w-8 h-8 text-cyan-400" />,
      title: 'Express Insured Dispatch',
      description: 'Direct air dispatch across metro cities with live SMS/WhatsApp real-time order tracking and free shipping above ₹999.',
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: 'Interactive 3D Technology',
      description: 'Inspect authentic supplement jars in complete 360° 3D with interactive nutritional and ingredient breakdowns before ordering.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50/50 dark:bg-[#070a0f] transition-colors border-t border-gray-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
            The Protein Villa Standard
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Why Thousands of Athletes Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            We are redefining supplement authenticity in India through clinical transparency, batch lab certificates, and modern fitness tech.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-dark-surface p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl hover:border-brand-500/40 transition-all duration-300 space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
