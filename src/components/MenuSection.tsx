import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Search, Flame, Plus, Eye, Sparkles, Clock, Utensils } from 'lucide-react';
import { ItemDetailModal } from './ItemDetailModal';

export const MenuSection: React.FC = () => {
  const { language, t, isRtl, formatCurrency } = useLanguage();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [spiceFilter, setSpiceFilter] = useState<'all' | 'spicy' | 'mild'>('all');

  const categories = [
    { key: 'all', label: t.menu.all },
    { key: 'burgers', label: t.menu.burgers },
    { key: 'chicken', label: t.menu.chicken },
    { key: 'sides', label: t.menu.sides },
    { key: 'drinks', label: t.menu.drinks },
    { key: 'combos', label: t.menu.combos },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
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
  }, [activeCategory, searchQuery, spiceFilter]);

  return (
    <section id="menu" className="py-24 bg-stone-900/60 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase block mb-2">
              {t.menu.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-100 font-display tracking-tight">
              {t.menu.title}
            </h2>
            <p className="text-sm text-stone-400 mt-2 max-w-lg">
              {t.menu.customizableNotice}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-500 absolute top-1/2 -translate-y-1/2 left-3.5 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.menu.searchPlaceholder}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
          </div>
        </div>

        {/* Filter Controls: Category Tabs & Spice Toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-stone-800/80">
          
          {/* Category Tabs (Segmented Control) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map(cat => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'bg-stone-950/80 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-800/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Spice Selector */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 shrink-0 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSpiceFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                spiceFilter === 'all' ? 'bg-stone-850 text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {isRtl ? 'كل النكهات' : 'All Flavors'}
            </button>
            <button
              type="button"
              onClick={() => setSpiceFilter('spicy')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                spiceFilter === 'spicy' ? 'bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30' : 'text-stone-400 hover:text-orange-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{isRtl ? 'حار ناري' : 'Spicy Only'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSpiceFilter('mild')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                spiceFilter === 'mild' ? 'bg-stone-850 text-stone-100 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {isRtl ? 'بارد / عادي' : 'Mild Only'}
            </button>
          </div>

        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center text-stone-400 bg-stone-950/40 rounded-3xl border border-stone-800/60 p-8">
            <Utensils className="w-10 h-10 text-stone-600 mx-auto mb-3" />
            <p className="text-base font-medium">{t.menu.emptySearch}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="group relative bg-stone-950 border border-stone-850 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                {/* Visual Top Half with 65-75% dominant photo */}
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                    <img
                      src={item.image}
                      alt={item.name[language]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Top corner subtle editorial badge (at most 1) */}
                    {item.isChefSpecial && (
                      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-bold text-amber-300 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-amber-500/30">
                        {t.menu.chefSpecial}
                      </div>
                    )}
                    {!item.isChefSpecial && item.isPopular && (
                      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-bold text-orange-300 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-orange-500/30">
                        {t.menu.bestseller}
                      </div>
                    )}

                    {/* Quick view button overlay */}
                    <button
                      type="button"
                      onClick={() => setSelectedItemForModal(item)}
                      className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 p-2 rounded-lg bg-stone-950/80 hover:bg-stone-900 text-stone-300 hover:text-white backdrop-blur-md border border-stone-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title={t.menu.quickView}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2.5">
                    
                    {/* Unboxed Metadata Line with · */}
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <span className="uppercase text-amber-400/90 font-semibold tracking-wider">
                        {t.menu[item.category]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.calories} {t.menu.calories}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{item.prepTime} {t.menu.prepTime}</span>
                      </span>
                    </div>

                    {/* Meal Title */}
                    <h3 className="font-bold text-stone-100 text-lg leading-snug group-hover:text-amber-300 transition-colors">
                      {item.name[language]}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                      {item.description[language]}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar: Price & Action */}
                <div className="p-5 pt-0 mt-3 border-t border-stone-900 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider">
                      {language === 'ar' ? 'السعر' : 'Price'}
                    </div>
                    <div className="font-mono text-xl font-bold text-amber-400 tabular-nums">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedItemForModal(item)}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 transition-colors cursor-pointer"
                    >
                      {t.menu.quickView}
                    </button>

                    <button
                      type="button"
                      onClick={() => addToCart(item, 1)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-md shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
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
