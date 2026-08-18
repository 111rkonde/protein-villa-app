import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, ShieldCheck, Check, X } from 'lucide-react';
import { adminService } from '../services/admin.service';
import { productService } from '../services/product.service';
import { Product, Category, Brand } from '../types';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState('2999');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600');
  const [model3dColor, setModel3dColor] = useState('#10b981');
  const [model3dLabel, setModel3dLabel] = useState('WHEY ISOLATE');
  const [flavors, setFlavors] = useState('Double Rich Chocolate, Gourmet Vanilla');
  const [sizes, setSizes] = useState('1 kg (33 Servings), 2 kg (66 Servings)');
  const [goals, setGoals] = useState('Muscle Gain, Lean Muscle');
  const [verificationCode, setVerificationCode] = useState('PV-AUTH-CERTIFIED');

  // Nutrition
  const [servingSize, setServingSize] = useState('31g (1 Scoop)');
  const [servingsPerContainer, setServingsPerContainer] = useState('32');
  const [protein, setProtein] = useState('28');
  const [calories, setCalories] = useState('120');
  const [carbs, setCarbs] = useState('2');
  const [fat, setFat] = useState('1');
  const [bcaa, setBcaa] = useState('6.5g Branched Chain Aminos');

  const [saving, setSaving] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [prods, cats, brs] = await Promise.all([
        productService.getProducts({ limit: 50 }),
        productService.getCategories(),
        productService.getBrands(),
      ]);
      setProducts(prods.data || []);
      setCategories(cats);
      setBrands(brs);
      if (cats.length > 0 && !categoryId) setCategoryId(cats[0].id);
      if (brs.length > 0 && !brandId) setBrandId(brs[0].id);
    } catch (error) {
      console.error('Failed to load catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setName('');
    setPrice('2999');
    setDiscountPercent('10');
    setStockQuantity('50');
    setShortDescription('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setIsEditing(true);
    setEditingId(p.id);
    setName(p.name);
    setCategoryId(p.categoryId);
    setBrandId(p.brandId);
    setPrice(p.price.toString());
    setDiscountPercent(p.discountPercent.toString());
    setStockQuantity(p.stockQuantity.toString());
    setShortDescription(p.shortDescription || '');
    setDescription(p.description);
    setImageUrl(p.images?.[0] || '');
    setModel3dColor(p.model3dColor || '#10b981');
    setModel3dLabel(p.model3dLabel || 'WHEY ISOLATE');
    setFlavors(p.flavorOptions?.join(', ') || '');
    setSizes(p.sizeOptions?.join(', ') || '');
    setGoals(p.goalTags?.join(', ') || '');
    setVerificationCode(p.verificationCode || '');

    if (p.nutritionInfo) {
      setServingSize(p.nutritionInfo.servingSize || '31g');
      setServingsPerContainer(p.nutritionInfo.servingsPerContainer?.toString() || '30');
      setProtein(p.nutritionInfo.protein?.toString() || '25');
      setCalories(p.nutritionInfo.calories?.toString() || '120');
      setCarbs(p.nutritionInfo.carbs?.toString() || '2');
      setFat(p.nutritionInfo.fat?.toString() || '1');
      setBcaa(p.nutritionInfo.bcaa || '');
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const productPayload = {
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      shortDescription: shortDescription.trim() || undefined,
      categoryId,
      brandId,
      price: Number(price),
      discountPercent: Number(discountPercent),
      stockQuantity: Number(stockQuantity),
      images: [imageUrl.trim()],
      flavorOptions: flavors.split(',').map((f) => f.trim()).filter(Boolean),
      sizeOptions: sizes.split(',').map((s) => s.trim()).filter(Boolean),
      goalTags: goals.split(',').map((g) => g.trim()).filter(Boolean),
      model3dColor,
      model3dLabel,
      verificationCode: verificationCode.trim() || undefined,
      nutritionInfo: {
        servingSize,
        servingsPerContainer: Number(servingsPerContainer),
        protein: Number(protein),
        calories: Number(calories),
        carbs: Number(carbs),
        fat: Number(fat),
        bcaa,
      },
    };

    try {
      if (isEditing && editingId) {
        await adminService.updateProduct(editingId, productPayload);
        showToast('Product specifications updated successfully! 🛠️', 'success');
      } else {
        await adminService.createProduct(productPayload);
        showToast('New Supplement added to catalog! ✨', 'success');
      }
      setIsModalOpen(false);
      await fetchCatalog();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await adminService.deleteProduct(id);
        showToast(`Product "${name}" deleted.`, 'info');
        await fetchCatalog();
      } catch (error) {
        showToast('Failed to delete product.', 'error');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
              Admin Catalog Operations
            </span>
            <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
              Product & 3D Model Management
            </h1>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Supplement</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or brand..."
            className="w-full bg-white dark:bg-dark-surface text-gray-900 dark:text-white text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-semibold"
          />
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching products..." />
        ) : (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                <tr>
                  <th className="p-4 font-bold text-gray-400 uppercase">Product</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Category</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Price (₹)</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Stock</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">3D Color</th>
                  <th className="p-4 font-bold text-gray-400 uppercase">Verification Code</th>
                  <th className="p-4 font-bold text-gray-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 object-contain rounded-xl bg-gray-50 dark:bg-slate-800 p-1"
                        />
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {p.brand?.name} • {p.nutritionInfo?.protein || 0}g Protein
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                      {p.category?.name}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white font-display text-sm">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      {p.discountPercent > 0 && (
                        <div className="text-[10px] text-rose-500 font-bold">
                          {p.discountPercent}% OFF
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          p.stockQuantity > 10
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: p.model3dColor || '#10b981' }}
                        />
                        <span className="font-mono text-[11px] text-gray-400">{p.model3dColor}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-brand-500">
                      {p.verificationCode || 'PV-UNVERIFIED'}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create / Edit Modal Dialog */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditing ? 'Edit Supplement Specifications' : 'Add New Supplement to Catalog'}
        >
          <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 text-xs">
            {/* Title */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PV ISO-Gold 100% Pure Whey Isolate"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
              />
            </div>

            {/* Category & Brand Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">Brand *</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price, Discount, Stock */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">Discount %</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">Stock Qty *</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                />
              </div>
            </div>

            {/* 3D Model Options */}
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 space-y-3">
              <span className="font-bold text-brand-400 uppercase tracking-wider">3D Jar Visualizer Settings</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Jar Color Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={model3dColor}
                      onChange={(e) => setModel3dColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={model3dColor}
                      onChange={(e) => setModel3dColor(e.target.value)}
                      className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">3D Jar 3D Text Label</label>
                  <input
                    type="text"
                    value={model3dLabel}
                    onChange={(e) => setModel3dLabel(e.target.value)}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 uppercase font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Nutrition Facts */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">Supplement Nutrition Facts</span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-gray-400">Protein (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Fat (g)</label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-700 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Options Comma-Separated */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Flavors (Comma-separated)
              </label>
              <input
                type="text"
                value={flavors}
                onChange={(e) => setFlavors(e.target.value)}
                placeholder="Chocolate, Vanilla, Strawberry"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Sizes / Servings (Comma-separated)
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="1 kg, 2 kg, 4 kg"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Authenticity Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="PV-ISO-99824"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-brand-500 text-black font-black rounded-xl hover:bg-brand-400 shadow-neon transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
