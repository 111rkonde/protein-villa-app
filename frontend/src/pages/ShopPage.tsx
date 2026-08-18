import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { productService } from '../services/product.service';
import { Product, Category, Brand } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilterSidebar } from '../components/product/ProductFilterSidebar';
import { ProductCardSkeleton } from '../components/common/Skeleton';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialGoal = searchParams.get('goal') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = (searchParams.get('sort') as any) || 'popular';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Filter States
  const [search, setSearch] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedGoal, setSelectedGoal] = useState<string>(initialGoal);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Load Categories & Brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, brs] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
        ]);
        setCategories(cats);
        setBrands(brs);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products based on all active filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        goal: selectedGoal || undefined,
        maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
        inStock: inStockOnly || undefined,
        rating: minRating > 0 ? minRating : undefined,
        sortBy: sortBy as any,
        page,
        limit: 12,
      });

      setProducts(res.data || []);
      setTotalCount(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedBrand, selectedGoal, priceRange, inStockOnly, minRating, sortBy, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedGoal('');
    setPriceRange([0, 10000]);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('popular');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
              Verified Fitness Catalog
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1">
              Explore All Supplements
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Showing {totalCount} authentic performance products
            </p>
          </div>

          {/* Controls: Search Bar & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-900 dark:text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-500" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white dark:bg-dark-surface px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800">
              <span className="text-xs font-bold text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="popular" className="bg-white dark:bg-slate-900">Most Popular</option>
                <option value="price_asc" className="bg-white dark:bg-slate-900">Price: Low to High</option>
                <option value="price_desc" className="bg-white dark:bg-slate-900">Price: High to Low</option>
                <option value="rating" className="bg-white dark:bg-slate-900">Highest Rated</option>
                <option value="newest" className="bg-white dark:bg-slate-900">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory || selectedBrand || selectedGoal || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-gray-400">Active Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-bold text-brand-500">
                Search: "{search}"
                <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-bold text-brand-500">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedBrand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-bold text-brand-500">
                Brand Filter
                <button onClick={() => setSelectedBrand('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGoal && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-bold text-brand-500">
                Goal: {selectedGoal}
                <button onClick={() => setSelectedGoal('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-500 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28">
            <ProductFilterSidebar
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              minRating={minRating}
              setMinRating={setMinRating}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Product Cards Grid */}
          <main className="lg:col-span-9 space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-surface p-12 rounded-3xl border border-gray-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  No Supplements Match Your Filter
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Try widening your price range, clearing specific filters, or searching for broader supplement terms.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs hover:bg-brand-400 shadow-neon transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:border-brand-500 transition"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition ${
                        page === pNum
                          ? 'bg-brand-500 text-black shadow-neon font-black'
                          : 'bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:border-brand-500'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:border-brand-500 transition"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-dark-surface p-6 overflow-y-auto">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-slate-800 mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilterSidebar
                categories={categories}
                brands={brands}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedGoal={selectedGoal}
                setSelectedGoal={setSelectedGoal}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                minRating={minRating}
                setMinRating={setMinRating}
                onReset={handleResetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
