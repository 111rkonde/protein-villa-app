import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, CheckCircle2, Sparkles, Plus } from 'lucide-react';

export const StackBuilderPreview: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-950/40 via-[#0c1420] to-[#070b12] border-y border-emerald-500/20 text-white relative overflow-hidden">
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Description */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Supplement Stack Builder</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Build Your Personalized Monthly Supplement Stack & Save Up to 25%
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Combine Whey Isolate, Micronized Creatine, Multivitamins, and Pre-Workout into an optimized daily routine. Calculate monthly cost and add your complete custom stack with one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/supplement-stack"
                className="flex items-center gap-2 px-8 py-4 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition hover:scale-105"
              >
                <Layers className="w-5 h-5" />
                <span>Open Stack Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Stack Card Mockup */}
          <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
                <span className="font-bold text-sm text-white">Example: Muscle Hypertrophy Stack</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Saved ₹1,200
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  <span className="font-bold">PV ISO-Gold 100% Whey (2 kg)</span>
                </div>
                <span className="text-brand-400 font-bold">₹3,654</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  <span className="font-bold">PV Creapure Micronized Creatine (250g)</span>
                </div>
                <span className="text-brand-400 font-bold">₹959</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  <span className="font-bold">PV Volt-X Pre-Workout (30 Servings)</span>
                </div>
                <span className="text-brand-400 font-bold">₹1,949</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold">Bundle Monthly Cost</div>
                <div className="font-display text-2xl font-black text-white">₹6,562</div>
              </div>
              <Link
                to="/supplement-stack"
                className="px-4 py-2 bg-brand-500 text-black text-xs font-bold rounded-xl hover:bg-brand-400 transition"
              >
                Customize Stack →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
