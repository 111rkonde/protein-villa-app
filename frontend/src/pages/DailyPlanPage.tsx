import React, { useState } from 'react';
import { Sun, Zap, Activity, Flame, Moon, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DailyPlanPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<'muscle' | 'shred' | 'strength'>('muscle');

  const plans = {
    muscle: [
      {
        time: '7:30 AM',
        period: 'Morning Awakening',
        icon: <Sun className="w-6 h-6 text-amber-400" />,
        title: 'Vitality & Hydration Foundation',
        supplements: ['PV Ultra Gold Omega-3 (1 Softgel)', 'PV Multi-Elite Vitamin (1 Tablet)', '500ml Water'],
        instructions: 'Take after your high-protein breakfast (e.g. 4 eggs + oats) to enhance fat-soluble vitamin assimilation.',
        protein: '35g (from breakfast)',
      },
      {
        time: '5:30 PM',
        period: 'Pre-Workout (30m Before)',
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        title: 'High-Stim Neuro-Focus Ignition',
        supplements: ['PV Volt-X Pre-Workout (1 Scoop in 250ml cold water)', 'PV Creapure Creatine (5g)'],
        instructions: 'Sip 20-30 minutes prior to warm-up. Increases nitric oxide vasodilation, cellular ATP, and explosive power.',
        protein: '0g (Energy & Focus)',
      },
      {
        time: '6:30 PM',
        period: 'Intra-Workout Hydration',
        icon: <Activity className="w-6 h-6 text-emerald-400" />,
        title: 'Anti-Catabolic Muscle Defense',
        supplements: ['PV Matrix 9-EAA / BCAA (1 Scoop in 700ml water)'],
        instructions: 'Sip steadily throughout heavy working sets to prevent muscle tissue breakdown and maintain electrolyte balance.',
        protein: '7g Aminos',
      },
      {
        time: '7:30 PM',
        period: 'Post-Workout Anabolic Window',
        icon: <Flame className="w-6 h-6 text-orange-500" />,
        title: 'Rapid Isolate Muscle Synthesis',
        supplements: ['PV ISO-Gold 100% Whey Isolate (1.5 Scoops in 300ml water)', 'Fast-acting simple carb (1 Banana)'],
        instructions: 'Consume within 30 minutes of session completion for rapid leucine-triggered muscle protein synthesis.',
        protein: '42g Native Isolate',
      },
      {
        time: '10:30 PM',
        period: 'Bedtime Recovery',
        icon: <Moon className="w-6 h-6 text-purple-400" />,
        title: 'Nocturnal Muscle Repair & Sleep',
        supplements: ['Micellar Casein / Greek Yogurt + Peanut Butter (2 Tbsp)', 'ZMA / Magnesium (Optional)'],
        instructions: 'Provides slow-drip amino acid release over 7-8 hours of sleep to prevent overnight muscle catabolism.',
        protein: '28g Sustained Release',
      },
    ],
    shred: [
      {
        time: '7:30 AM',
        period: 'Morning Fasted / Light Breakfast',
        icon: <Sun className="w-6 h-6 text-amber-400" />,
        title: 'Thermogenic & Micronutrient Boost',
        supplements: ['PV Ultra Gold Omega-3', 'Green Tea Extract / L-Carnitine', 'PV Multi-Elite'],
        instructions: 'Promotes mitochondrial fatty acid oxidation during morning cardio sessions.',
        protein: '30g',
      },
      {
        time: '5:30 PM',
        period: 'Pre-Workout Ignition',
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        title: 'Calorie Burn & Energy',
        supplements: ['PV Volt-X (1 Scoop)', 'L-Carnitine 3000'],
        instructions: 'Maintains training intensity during caloric deficits.',
        protein: '0g',
      },
      {
        time: '7:30 PM',
        period: 'Post-Workout Window',
        icon: <Flame className="w-6 h-6 text-orange-500" />,
        title: 'Zero-Carb Pure Isolate Recovery',
        supplements: ['PV ISO-Gold 100% Whey Isolate (1 Scoop in cold water)'],
        instructions: 'Pure protein isolate with zero added sugar and zero fat to protect lean muscle mass.',
        protein: '28g Pure Protein',
      },
      {
        time: '10:30 PM',
        period: 'Night Rest',
        icon: <Moon className="w-6 h-6 text-purple-400" />,
        title: 'Deep REM Sleep & Recovery',
        supplements: ['Magnesium Glycinate + Chamomile', 'Low-calorie protein snack'],
        instructions: 'Ensures optimal cortisol reduction and restorative growth hormone release.',
        protein: '15g',
      },
    ],
    strength: [
      {
        time: '8:00 AM',
        period: 'Heavy Morning Breakfast',
        icon: <Sun className="w-6 h-6 text-amber-400" />,
        title: 'Caloric & Mineral Loading',
        supplements: ['PV Monster Mass Gainer (1/2 Serving)', 'Omega-3 + Multivitamin'],
        instructions: 'Fuel glycogen reserves for heavy compound squat/bench/deadlift days.',
        protein: '50g Total',
      },
      {
        time: '5:00 PM',
        period: 'Pre-Lift Activation',
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        title: 'Heavy CNS Stimulant & Creapure',
        supplements: ['PV Volt-X (1 Heaping Scoop)', 'Creapure Micronized Creatine (5g)'],
        instructions: 'Maximize intra-cellular phosphocreatine reserves for 1-5 rep max strength efforts.',
        protein: '0g',
      },
      {
        time: '7:30 PM',
        period: 'Post-Heavy Lifting Protocol',
        icon: <Flame className="w-6 h-6 text-orange-500" />,
        title: 'Hyper-Anabolic High Calorie Refuel',
        supplements: ['PV Monster Mass Gainer (1 Scoop with 400ml Whole Milk)'],
        instructions: 'Replenish glycogen stores and accelerate connective tissue and central nervous system recovery.',
        protein: '52g High Calorie',
      },
    ],
  };

  const currentTimeline = plans[selectedGoal] || plans.muscle;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Optimal Nutrient Timing Protocol</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            Smart Daily Supplement Schedule
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Timing matters as much as dosage. Follow our precision 24-hour athlete schedule to maximize absorption, gym stamina, and nocturnal recovery.
          </p>
        </div>

        {/* Goal Switcher Tabs */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto bg-white dark:bg-dark-surface p-1.5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-md">
          {[
            { id: 'muscle', label: 'Hypertrophy / Bulk' },
            { id: 'shred', label: 'Fat Shredding' },
            { id: 'strength', label: 'Power & Strength' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedGoal(item.id as any)}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                selectedGoal === item.id
                  ? 'bg-brand-500 text-black shadow-neon'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Timeline Progression */}
        <div className="space-y-6">
          {currentTimeline.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-brand-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm shrink-0">
                  {step.icon}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/20">
                      {step.time}
                    </span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {step.period}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                    {step.instructions}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {step.supplements.map((sup, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 dark:bg-slate-800/80 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-xl border border-gray-200/60 dark:border-slate-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                        <span>{sup}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800 w-full md:w-auto">
                <div className="text-[10px] uppercase font-bold text-gray-400">Protein Target</div>
                <div className="font-display text-lg sm:text-xl font-black text-brand-500">
                  {step.protein}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 p-8 rounded-3xl border border-emerald-500/40 shadow-2xl text-center space-y-4">
          <h3 className="font-display text-2xl font-black text-white">
            Ready to Put This Daily Plan Into Action?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            Order your essential morning, pre, post, and bedtime supplements with 100% authenticity guarantee.
          </p>
          <Link
            to="/supplement-stack"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
          >
            <span>Build Your Daily Stack Bundle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
