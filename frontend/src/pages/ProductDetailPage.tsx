import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  Scale,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';
import { productService } from '../services/product.service';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { SupplementJar3D } from '../components/3d/SupplementJar3D';
import { NutritionFactsTable } from '../components/product/NutritionFactsTable';
import { ProductReviews } from '../components/product/ProductReviews';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected options
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'benefits' | 'howToUse' | 'reviews'>('nutrition');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await productService.getProduct(id);
        setProduct(prod);
        setSelectedFlavor(prod.flavorOptions?.[0] || 'Default');
        setSelectedSize(prod.sizeOptions?.[0] || 'Standard');

        // Fetch related products
        const related = await productService.getRecommendations(prod.goalTags?.[0], 4);
        setRelatedProducts(related.filter((r: Product) => r.id !== prod.id).slice(0, 4));
      } catch (error) {
        console.error('Failed to load product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Rendering 3D supplement view..." fullPage />;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-gray-400 text-sm">The supplement you are looking for does not exist or has been discontinued.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-brand-500 text-black font-bold text-xs rounded-xl hover:bg-brand-400"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const finalPrice =
    product.discountPercent > 0
      ? Math.round(product.price * (1 - product.discountPercent / 100))
      : product.price;

  const isLiked = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      flavor: selectedFlavor,
      quantity,
    });
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-8 md:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-semibold">
          <Link to="/" className="hover:text-brand-500">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-brand-500">Supplements</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/products?category=${product.category?.slug}`} className="hover:text-brand-500">
            {product.category?.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 dark:text-white truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: 3D Visualizer & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <SupplementJar3D
              color={product.model3dColor || '#10b981'}
              label={product.model3dLabel || 'WHEY ISOLATE'}
              categoryName={product.category?.name || 'Protein'}
              fallbackImage={product.images[0]}
              productName={product.name}
            />

            {/* Authenticity Guarantee Banner */}
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/40 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-brand-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    100% Genuine Certified Batch
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Serial Code: <strong className="text-brand-500">{product.verificationCode || 'PV-AUTH-CERTIFIED'}</strong>
                  </div>
                </div>
              </div>
              <Link
                to={`/verify?code=${encodeURIComponent(product.verificationCode || '')}`}
                className="px-3.5 py-1.5 bg-brand-500 text-black font-black text-xs rounded-xl hover:bg-brand-400 shadow-neon transition"
              >
                Verify Code →
              </Link>
            </div>
          </div>

          {/* Right Column: Product Options & Purchase Controls */}
          <div className="lg:col-span-5 bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Brand & Title */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-extrabold uppercase tracking-wider text-brand-500">
                  {product.brand?.name}
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-900 dark:text-white">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {product.shortDescription && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Price & Savings Tag */}
            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-baseline gap-3">
              <span className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {product.discountPercent > 0 && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-black bg-rose-500 text-white px-2.5 py-0.5 rounded-full uppercase">
                    Save {product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Flavor Options Selection */}
            {product.flavorOptions?.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Select Flavor: <strong className="text-gray-900 dark:text-white">{selectedFlavor}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.flavorOptions.map((flavor: string) => (
                    <button
                      key={flavor}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedFlavor === flavor
                          ? 'bg-brand-500 text-black border-brand-400 shadow-neon'
                          : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-800 hover:border-gray-300'
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size / Weight Selection */}
            {product.sizeOptions?.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Select Size / Servings: <strong className="text-gray-900 dark:text-white">{selectedSize}</strong>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizeOptions.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                        selectedSize === size
                          ? 'bg-brand-500 text-black border-brand-400 shadow-neon'
                          : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-800 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Qty:</span>
                <div className="flex items-center bg-gray-100 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs font-bold text-emerald-500">
                {product.stockQuantity > 0 ? `✓ In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0}
                  className="flex items-center justify-center gap-2 py-3.5 bg-gray-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl border border-gray-700 transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity <= 0}
                  className="flex items-center justify-center gap-2 py-3.5 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Wishlist & Compare Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition ${
                    isLiked
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                      : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{isLiked ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={() => addToCompare(product)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition ${
                    isCompared
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      : 'bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Nutrition Facts, Description & How to Use */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-slate-800 gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'nutrition'
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Supplement Nutrition Facts
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'benefits'
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Benefits & Description
            </button>
            <button
              onClick={() => setActiveTab('howToUse')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'howToUse'
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              How to Use & Dosage
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition ${
                activeTab === 'reviews'
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'nutrition' && (
            <div className="max-w-2xl">
              <NutritionFactsTable nutrition={product.nutritionInfo} />
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4 max-w-4xl">
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                About {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-300">
                    Native whey fractions with zero thermal denaturation.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-300">
                    Instantized formulation mixes in cold water in under 10 seconds.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-300">
                    Zero added sugars, no artificial thickeners or fillers.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-gray-300">
                    100% Informed-Choice and WADA anti-doping compliant.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl space-y-4 max-w-3xl">
              <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                Recommended Usage Instructions
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-gray-300">
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-brand-500">Post-Workout Window (Within 30 mins)</div>
                  <p className="text-gray-400">
                    Add 1 rounded scoop (31g) to 250-300ml of ice cold water or skimmed milk. Shake vigorously in your PV Shaker for 15-20 seconds.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-brand-500">Morning / Between Meals</div>
                  <p className="text-gray-400">
                    Blend with oats, banana, and peanut butter for a nutrient-dense high-protein breakfast smoothie.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ProductReviews productId={product.id} />
          )}
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-gray-200 dark:border-slate-800">
            <h3 className="font-display text-2xl font-black text-gray-900 dark:text-white">
              Frequently Bought Together & Similar Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
