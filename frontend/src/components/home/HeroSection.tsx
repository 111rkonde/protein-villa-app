import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Flame, CheckCircle } from 'lucide-react';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-[#0a0d14] dark:via-[#070a10] dark:to-[#0a0d14] py-6 sm:py-12 md:py-20">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-600 dark:text-brand-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider animate-pulse">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Next-Gen Nutrition & 3D Lab</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight sm:leading-[1.1]">
              POWER YOUR PERFORMANCE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-emerald-400 to-teal-300">
                BUILD YOUR BEST SELF.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              India's premier fitness nutrition destination. 100% authentic Whey Isolates, Mass Gainers, Creatine, and Pre-Workouts backed by 3rd-party HPLC purity certification.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl hover:bg-brand-400 shadow-neon hover:scale-105 transition-all duration-200"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/protein-calculator"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-slate-900/80 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-900 dark:text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm transition"
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Calculate Protein Goal</span>
              </Link>
            </div>

            {/* Trust Bullet Seals */}
            <div className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                <span>100% HPLC Lab Certified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                <span>Fast & Insured Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                <span>Authenticity Code Check</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Supplement Model */}
          <div className="lg:col-span-5 h-[280px] xs:h-[340px] sm:h-[480px] w-full bg-gradient-to-b from-slate-900/50 via-[#0d1420]/60 to-[#070a10]/80 rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden relative">
            <Hero3DCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};
