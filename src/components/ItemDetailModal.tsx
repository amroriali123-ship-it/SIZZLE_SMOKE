import React, { useState } from 'react';
import { MenuItem, CartItemOption } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { X, Flame, Clock, Sparkles, Check, AlertCircle, ShoppingBag } from 'lucide-react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const { language, t, isRtl, formatCurrency } = useLanguage();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<CartItemOption[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  if (!item) return null;

  const availableAddons: CartItemOption[] = [
    { name: { ar: t.modal.extraCheese, en: t.modal.extraCheese }, price: 5 },
    { name: { ar: t.modal.extraBacon, en: t.modal.extraBacon }, price: 6 },
    { name: { ar: t.modal.extraJalapeno, en: t.modal.extraJalapeno }, price: 3 },
    { name: { ar: t.modal.extraTruffle, en: t.modal.extraTruffle }, price: 4 },
  ];

  const toggleAddon = (addon: CartItemOption) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.name.en === addon.name.en);
      if (exists) {
        return prev.filter(a => a.name.en !== addon.name.en);
      }
      return [...prev, addon];
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const itemTotal = (item.price + addonsTotal) * quantity;

  const handleAddAndClose = () => {
    addToCart(item, quantity, selectedAddons, specialNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2.5 rounded-full bg-stone-950/70 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Header Image Slot with fallback */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-stone-950 border border-stone-800">
            <img
              src={item.image}
              alt={item.name[language]}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-4 inset-x-4 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  {t.menu[item.category]}
                </span>
                <h3 className="text-2xl font-black text-stone-100 font-display">
                  {item.name[language]}
                </h3>
              </div>
              <div className="text-xl font-black text-amber-400 tabular-nums">
                {formatCurrency(item.price)}
              </div>
            </div>
          </div>

          {/* Quick Metrics (Calories, Prep, Spice) */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{item.prepTime} {t.menu.prepTime}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="tabular-nums">{item.calories} {t.menu.calories}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Flame className={`w-4 h-4 ${item.spiceLevel > 0 ? 'text-orange-500 fill-orange-500' : 'text-stone-500'}`} />
              <span>
                {item.spiceLevel === 0 && t.menu.spice0}
                {item.spiceLevel === 1 && t.menu.spice1}
                {item.spiceLevel === 2 && t.menu.spice2}
                {item.spiceLevel === 3 && t.menu.spice3}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-stone-300 text-sm leading-relaxed">
            {item.description[language]}
          </p>

          {/* Key Ingredients */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              {t.modal.ingredients}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {item.ingredients[language].map((ing, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-stone-950 border border-stone-800 text-stone-300"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Allergen Notice */}
          {item.allergens && item.allergens[language].length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-300/90">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{t.modal.allergens} </span>
                <span>{item.allergens[language].join('، ')}</span>
              </div>
            </div>
          )}

          {/* Custom Addons Selection */}
          <div>
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
              {t.modal.customAddons}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableAddons.map((addon, idx) => {
                const isSelected = selectedAddons.some(a => a.name.en === addon.name.en);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 text-stone-100'
                        : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isSelected ? 'bg-amber-500 border-amber-500 text-stone-950' : 'border-stone-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{addon.name[language]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chef Notes / Special Request */}
          <div>
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              {t.modal.specialNotes}
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder={t.modal.notesPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-stone-800 rounded-xl bg-stone-900 overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-sm font-bold"
            >
              -
            </button>
            <span className="px-3 py-2 text-stone-100 font-mono font-bold text-sm min-w-8 text-center tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors text-sm font-bold"
            >
              +
            </button>
          </div>

          {/* Add to Tray Button */}
          <button
            type="button"
            onClick={handleAddAndClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.modal.addWithCustom}</span>
            <span className="font-mono tabular-nums font-black ml-1 rtl:ml-0 rtl:mr-1">
              ({formatCurrency(itemTotal)})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
