import React, { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/mockData';
import { api, ApiMenuItem, ApiCategory } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Search, Flame, Plus, Eye, Clock, Utensils, RefreshCw, AlertCircle } from 'lucide-react';
import { ItemDetailModal } from './ItemDetailModal';

export const MenuSection: React.FC = () => {
  const { language, t, isRtl, formatCurrency } = useLanguage();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [spiceFilter, setSpiceFilter] = useState<'all' | 'spicy' | 'mild'>('all');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiItems, setApiItems] = useState<ApiMenuItem[]>([]);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);

  // Fetch dynamic menu from API
  const fetchMenuData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuRes, catRes] = await Promise.all([
        api.getMenu(),
        api.getCategories(),
      ]);
      if (menuRes.data && menuRes.data.length > 0) {
        setApiItems(menuRes.data);
      }
      if (catRes.data && catRes.data.length > 0) {
        setApiCategories(catRes.data);
      }
    } catch (err: any) {
      console.warn('API fetch warning (using fallback data):', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Map ApiMenuItem to MenuItem interface for UI compatibility
  const combinedItems: MenuItem[] = useMemo(() => {
    if (apiItems.length > 0) {
      return apiItems.map((apiItem) => {
        // Find matching category key or fallback
        const catId = apiItem.category;
        let mappedCat: MenuItem['category'] = 'burgers';
        if (catId.includes('chicken')) mappedCat = 'chicken';
        else if (catId.includes('side')) mappedCat = 'sides';
        else if (catId.includes('drink')) mappedCat = 'drinks';
        else if (catId.includes('combo')) mappedCat = 'combos';

        return {
          id: apiItem.id,
          name: {
            en: apiItem.name_en,
            ar: apiItem.name_ar,
          },
          category: mappedCat,
          description: {
            en: apiItem.description_en,
            ar: apiItem.description_ar,
          },
          price: apiItem.price_sar,
          image: apiItem.imageUrl || '/src/assets/images/hero_gourmet_smash_burger_1791416652236.jpg',
          calories: apiItem.calories || 650,
          prepTime: apiItem.prepTime || '6-8',
          spiceLevel: (apiItem.spiceLevel as any) || 0,
          tags: {
            en: apiItem.isFeatured ? ['Featured', 'Popular'] : ['House Made'],
            ar: apiItem.isFeatured ? ['الأكثر طلباً', 'مميز'] : ['طازج يومياً'],
          },
          ingredients: {
            en: apiItem.ingredients_en || ['Brioche Bun', 'Angus Beef'],
            ar: apiItem.ingredients_ar || ['خبز بريوش', 'لحم أنجوس'],
          },
          allergens: {
            en: ['Gluten', 'Dairy'],
            ar: ['غلوتين', 'مشتقات الحليب'],
          },
          isPopular: apiItem.isFeatured,
          isChefSpecial: apiItem.isFeatured,
        };
      });
    }
    // Fallback to initial mock if API returned empty
    return MENU_ITEMS;
  }, [apiItems]);

  const categories = useMemo(() => {
    if (apiCategories.length > 0) {
      const dynamic = apiCategories.map((c) => ({
        key: c.id.replace('cat-', ''),
        label: language === 'ar' ? c.name_ar : c.name_en,
      }));
      return [{ key: 'all', label: t.menu.all }, ...dynamic];
    }
    return [
      { key: 'all', label: t.menu.all },
      { key: 'burgers', label: t.menu.burgers },
      { key: 'chicken', label: t.menu.chicken },
      { key: 'sides', label: t.menu.sides },
      { key: 'drinks', label: t.menu.drinks },
      { key: 'combos', label: t.menu.combos },
    ];
  }, [apiCategories, language, t.menu]);

  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      // Category match
      if (activeCategory !== 'all') {
        if (!item.category.includes(activeCategory) && activeCategory !== item.category) {
          return false;
        }
      }
      // Spice match
      if (spiceFilter === 'spicy' && item.spiceLevel === 0) return false;
      if (spiceFilter === 'mild' && item.spiceLevel > 0) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameAr = item.name.ar.toLowerCase();
        const nameEn = item.name.en.toLowerCase();
        const descAr = item.description.ar.toLowerCase();
        const descEn = item.description.en.toLowerCase();
        return (
          nameAr.includes(q) ||
          nameEn.includes(q) ||
          descAr.includes(q) ||
          descEn.includes(q)
        );
      }
      return true;
    });
  }, [combinedItems, activeCategory, searchQuery, spiceFilter]);

  return (
    <section id="menu" className="py-24 bg-stone-50 border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase block">
                {t.menu.subtitle}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                ● Live API
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight">
              {t.menu.title}
            </h2>
            <p className="text-sm text-stone-500 mt-2 max-w-lg">
              {t.menu.customizableNotice}
            </p>
          </div>

          {/* Search Box & Refresh */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.menu.searchPlaceholder}
                className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 shadow-xs transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={fetchMenuData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 shadow-xs transition-colors cursor-pointer"
              title="Refresh menu from backend API"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Controls: Category Tabs & Spice Toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 shadow-xs'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Spice Selector */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-xs shrink-0 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSpiceFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                spiceFilter === 'all' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {isRtl ? 'كل النكهات' : 'All Flavors'}
            </button>
            <button
              type="button"
              onClick={() => setSpiceFilter('spicy')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                spiceFilter === 'spicy' ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200' : 'text-stone-500 hover:text-orange-600'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{isRtl ? 'حار ناري' : 'Spicy Only'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSpiceFilter('mild')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                spiceFilter === 'mild' ? 'bg-stone-100 text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {isRtl ? 'بارد / عادي' : 'Mild Only'}
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-stone-200 rounded-2xl overflow-hidden h-96">
                <div className="bg-stone-200 h-48 w-full" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-6 bg-stone-200 rounded w-2/3" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && filteredItems.length === 0 ? (
          <div className="py-20 text-center text-stone-500 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <Utensils className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="text-base font-medium">{t.menu.emptySearch}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              >
                {/* Visual Top Half */}
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-80" />

                    {/* Top corner subtle editorial badge */}
                    {item.isChefSpecial && (
                      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-bold text-amber-900 bg-amber-100/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-300 shadow-xs">
                        {t.menu.chefSpecial}
                      </div>
                    )}
                    {!item.isChefSpecial && item.isPopular && (
                      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-bold text-orange-900 bg-orange-100/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-orange-300 shadow-xs">
                        {t.menu.bestseller}
                      </div>
                    )}

                    {/* Quick view button overlay */}
                    <button
                      type="button"
                      onClick={() => setSelectedItemForModal(item)}
                      className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 p-2 rounded-lg bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 backdrop-blur-md shadow-md border border-stone-200 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title={t.menu.quickView}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2.5">
                    {/* Unboxed Metadata Line with · */}
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="uppercase text-amber-700 font-bold tracking-wider">
                        {t.menu[item.category] || item.category}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="tabular-nums">{item.calories} {t.menu.calories}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{item.prepTime} {t.menu.prepTime}</span>
                      </span>
                    </div>

                    {/* Meal Title */}
                    <h3 className="font-bold text-stone-900 text-lg leading-snug group-hover:text-amber-600 transition-colors">
                      {item.name[language]}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {item.description[language]}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Price & Action */}
                <div className="p-5 pt-0 mt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">
                      {language === 'ar' ? 'السعر' : 'Price'}
                    </div>
                    <div className="font-mono text-xl font-bold text-amber-600 tabular-nums">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItemForModal(item)}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80 transition-colors cursor-pointer"
                    >
                      {t.menu.quickView}
                    </button>

                    <button
                      type="button"
                      onClick={() => addToCart(item, 1)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{t.menu.addToTray}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItemForModal && (
        <ItemDetailModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}
    </section>
  );
};
