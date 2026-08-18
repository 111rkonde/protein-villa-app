import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  Calculator,
  Flame,
  Layers,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Package,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/product.service';
import { Product } from '../../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { openCart, itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCalcMenuOpen, setIsCalcMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productService.getProducts({ search: searchQuery, limit: 5 });
        setSearchResults(res.data || []);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#0a0d12]/90 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-black dark:text-black font-semibold text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span>⚡ 100% Authentic HPLC Lab-Tested Supplements</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">🚚 FREE Shipping on orders over ₹999</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden sm:inline">Use Code <strong>WELCOME10</strong> for 10% OFF</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-black shadow-neon group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 transform -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-gray-900 dark:text-white flex items-center gap-1">
                PROTEIN<span className="text-brand-500">VILLA</span>
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 dark:text-gray-400 font-bold uppercase -mt-1">
                Fuel Your Goals
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <Link to="/products" className="hover:text-brand-500 transition">
              Shop All
            </Link>

            {/* Calculators Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsCalcMenuOpen(!isCalcMenuOpen)}
                className="flex items-center gap-1 hover:text-brand-500 transition py-2"
              >
                <Calculator className="w-4 h-4 text-brand-500" />
                <span>Calculators</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 w-64 pt-2 hidden group-hover:block transition-all">
                <div className="bg-white dark:bg-dark-surface p-2 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 space-y-1">
                  <Link
                    to="/protein-calculator"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-brand-500">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">Protein Goal Calculator</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Target protein & meal breakdown</div>
                    </div>
                  </Link>
                  <Link
                    to="/fitness-calculator"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/80 transition"
                  >
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-sm">BMI / BMR / TDEE</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Calories, macros & body metrics</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/protein-tracker" className="flex items-center gap-1.5 hover:text-brand-500 transition">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Daily Tracker</span>
            </Link>

            <Link to="/supplement-stack" className="flex items-center gap-1.5 hover:text-brand-500 transition">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Stack Builder</span>
            </Link>

            <Link to="/verify" className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-500 transition">
              <ShieldCheck className="w-4 h-4" />
              <span>PV Verify</span>
            </Link>
          </nav>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-xs lg:max-w-sm">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                  placeholder="Search Whey, Creatine, Isolate..."
                  className="w-full bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-2 z-50 overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-gray-400">Searching catalog...</div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Product Matches
                    </div>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/products/${item.slug || item.id}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800/80 transition"
                      >
                        <img
                          src={item.images[0] || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=100'}
                          alt={item.name}
                          className="w-10 h-10 object-contain rounded-lg bg-gray-50 dark:bg-slate-900 p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span>{item.brand?.name}</span>
                            <span>•</span>
                            <span className="font-semibold text-brand-500">₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs font-bold text-brand-500 hover:underline border-t border-gray-100 dark:border-slate-800 mt-1"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-400">No supplements found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface border border-transparent hover:border-gray-200 dark:hover:border-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface border border-transparent hover:border-gray-200 dark:hover:border-slate-800 transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface border border-transparent hover:border-gray-200 dark:hover:border-slate-800 transition"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-neon">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Dropdown */}
            {isAuthenticated && user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-gray-200 dark:border-slate-800 hover:border-brand-500 transition"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 mr-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800">
                      <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-xs text-gray-400 truncate">{user.email}</div>
                      <span className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isAdmin ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/10 rounded-xl transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Fitness Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/protein-tracker"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span>Protein Tracker</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs sm:text-sm font-bold hover:bg-brand-500 dark:hover:bg-brand-400 dark:hover:text-black transition shadow-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface"
              aria-label="Open Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplements..."
                className="w-full bg-gray-100 dark:bg-dark-surface text-gray-900 dark:text-white text-xs pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-slide-down">
          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-brand-500"
          >
            Shop All Products
          </Link>
          <Link
            to="/protein-calculator"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-brand-500"
          >
            Protein Goal Calculator
          </Link>
          <Link
            to="/fitness-calculator"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-brand-500"
          >
            BMI & Macro Calculator
          </Link>
          <Link
            to="/protein-tracker"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-brand-500"
          >
            Daily Protein Tracker
          </Link>
          <Link
            to="/supplement-stack"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-brand-500"
          >
            Supplement Stack Builder
          </Link>
          <Link
            to="/verify"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-emerald-500 hover:text-emerald-400"
          >
            ✓ Authenticity Check (PV Verify)
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-amber-400"
            >
              👑 Admin Portal
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
