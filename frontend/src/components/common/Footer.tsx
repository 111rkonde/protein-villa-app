import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, Truck, RefreshCw, Award, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#07090e] border-t border-gray-200 dark:border-slate-800 text-gray-600 dark:text-gray-400 transition-colors">
      {/* Brand Value Pillars */}
      <div className="border-b border-gray-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">100% Authentic</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Direct from verified manufacturers with HPLC lab seals.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Express Delivery</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Free lightning-fast shipping across India on orders over ₹999.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Expert Guidance</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Targeted protein & macro calculators for your exact body goals.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Easy Returns</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Hassle-free 7-day replacement policy on all unopened supplements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-black shadow-neon">
                <Dumbbell className="w-5 h-5 transform -rotate-45" />
              </div>
              <span className="font-display text-2xl font-black text-gray-900 dark:text-white">
                PROTEIN<span className="text-brand-500">VILLA</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              Protein Villa is India's most trusted fitness nutrition destination. Delivering 100% authentic whey protein, gainers, creatine, and pre-workouts directly to dedicated athletes.
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>Protein Villa HQ, Koramangala 5th Block, Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                <span>+91 (800) 456-7890 (Mon-Sat, 9AM - 8PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>support@proteinvilla.demo</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/products?category=whey-protein" className="hover:text-brand-500 transition">
                  Whey Protein Isolate
                </Link>
              </li>
              <li>
                <Link to="/products?category=mass-gainers" className="hover:text-brand-500 transition">
                  Mass Gainers
                </Link>
              </li>
              <li>
                <Link to="/products?category=creatine-pre-workout" className="hover:text-brand-500 transition">
                  Creatine & Pre-Workout
                </Link>
              </li>
              <li>
                <Link to="/products?category=bcaa-aminos" className="hover:text-brand-500 transition">
                  BCAA & Aminos
                </Link>
              </li>
              <li>
                <Link to="/products?category=health-vitamins" className="hover:text-brand-500 transition">
                  Omega-3 & Multivitamins
                </Link>
              </li>
              <li>
                <Link to="/products?category=protein-foods-snacks" className="hover:text-brand-500 transition">
                  Peanut Butter & Bars
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Fitness Tools */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Fitness Tools
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/protein-calculator" className="hover:text-brand-500 transition">
                  Protein Goal Calculator
                </Link>
              </li>
              <li>
                <Link to="/fitness-calculator" className="hover:text-brand-500 transition">
                  BMI / BMR / TDEE Calculator
                </Link>
              </li>
              <li>
                <Link to="/protein-tracker" className="hover:text-brand-500 transition">
                  Daily Protein Tracker
                </Link>
              </li>
              <li>
                <Link to="/supplement-stack" className="hover:text-brand-500 transition">
                  Supplement Stack Builder
                </Link>
              </li>
              <li>
                <Link to="/daily-plan" className="hover:text-brand-500 transition">
                  Smart Daily Plan
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-brand-500 transition text-emerald-500 font-semibold">
                  Authenticity Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Support */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Account & Help
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/profile" className="hover:text-brand-500 transition">
                  My Fitness Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-brand-500 transition">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-500 transition">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-brand-500 transition">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-500 transition">
                  Sign In / Demo Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gray-200 dark:border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} Protein Villa Inc. All rights reserved. Fuel Your Goals. Build Your Best Self.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Lab Certificates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
