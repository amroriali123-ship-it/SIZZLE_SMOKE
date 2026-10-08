import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Trash2, CheckCircle2, Clock, Utensils, QrCode } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { language, t, isRtl, formatCurrency } = useLanguage();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    vat,
    grandTotal,
    totalItems,
    lastOrderTicket,
    submitSimulatedOrder,
    dismissOrderTicket,
  } = useCart();

  if (!isCartOpen && !lastOrderTicket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-stone-900 border-l rtl:border-l-0 rtl:border-r border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Order Confirmed Receipt Overlay */}
          {lastOrderTicket ? (
            <div className="p-6 sm:p-8 flex flex-col justify-between h-full bg-stone-950 overflow-y-auto animate-fade-in">
              <div className="space-y-6">
                <div className="text-center pt-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-100 font-display">
                    {t.cart.orderSuccess}
                  </h3>
                  <div className="text-xs text-stone-400 mt-1">
                    {t.cart.orderNumber}{' '}
                    <span className="font-mono font-bold text-amber-400 text-base">
                      {lastOrderTicket.orderNumber}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs text-amber-300 font-medium mt-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.cart.readyIn}</span>
                  </div>
                </div>

                {/* Items Summary in Receipt */}
                <div className="bg-stone-900 p-4 rounded-2xl border border-stone-850 space-y-3">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block border-b border-stone-800 pb-2">
                    {language === 'ar' ? 'ملخص الوجبات المطلوبة:' : 'Ordered Items:'}
                  </span>
                  {lastOrderTicket.items.map(item => (
                    <div key={item.cartItemId} className="flex justify-between text-xs text-stone-300">
                      <div>
                        <span className="font-bold text-amber-400 font-mono mr-1 rtl:mr-0 rtl:ml-1">
                          {item.quantity}x
                        </span>
                        <span>{item.item.name[language]}</span>
                      </div>
                      <span className="font-mono tabular-nums text-stone-400">
                        {formatCurrency(item.item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-stone-100 text-sm">
                    <span>{t.cart.total}</span>
                    <span className="text-amber-400 font-mono tabular-nums">
                      {formatCurrency(lastOrderTicket.total)}
                    </span>
                  </div>
                </div>

                {/* QR Visual */}
                <div className="flex items-center justify-center gap-4 bg-stone-900/50 p-4 rounded-2xl border border-stone-850">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-950">
                    <QrCode className="w-10 h-10" />
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    {language === 'ar'
                      ? 'أبرز هذا الرقم عند كاونتر الاستلام السريع في الفرع.'
                      : 'Show this ticket barcode at the branch express pickup counter.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  dismissOrderTicket();
                  setIsCartOpen(false);
                }}
                className="w-full mt-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                {language === 'ar' ? 'تم، إغلاق الإشعار' : 'Done, Close Receipt'}
              </button>
            </div>
          ) : (
            /* Normal Cart Drawer View */
            <>
              {/* Drawer Header */}
              <div className="p-6 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <h3 className="font-display font-bold text-lg text-stone-100">
                    {t.cart.trayTitle}
                  </h3>
                  <span className="text-xs text-stone-400">
                    ({totalItems} {t.cart.itemCount})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={clearCart}
                      className="p-1.5 text-stone-500 hover:text-red-400 transition-colors text-xs"
                      title={t.cart.clearTray}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center text-stone-500 space-y-3">
                    <Utensils className="w-12 h-12 text-stone-700 mx-auto" />
                    <p className="text-xs leading-relaxed max-w-xs mx-auto">
                      {t.cart.emptyTray}
                    </p>
                  </div>
                ) : (
                  cart.map((item) => {
                    const addonsTotal = item.selectedOptions.reduce((s, o) => s + o.price, 0);
                    const itemUnitTotal = item.item.price + addonsTotal;

                    return (
                      <div
                        key={item.cartItemId}
                        className="p-4 bg-stone-950 border border-stone-850 rounded-2xl space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-stone-200 text-sm">
                              {item.item.name[language]}
                            </h4>
                            <div className="font-mono text-xs text-amber-400 font-bold mt-0.5">
                              {formatCurrency(itemUnitTotal * item.quantity)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-stone-600 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Add-ons */}
                        {item.selectedOptions.length > 0 && (
                          <div className="text-[11px] text-stone-400 space-y-0.5">
                            {item.selectedOptions.map((opt, i) => (
                              <div key={i} className="flex justify-between">
                                <span>+ {opt.name[language]}</span>
                                <span className="font-mono">+{opt.price} SAR</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Special Notes */}
                        {item.specialNotes && (
                          <p className="text-[11px] text-stone-400 italic bg-stone-900/60 p-2 rounded-lg">
                            "{item.specialNotes}"
                          </p>
                        )}

                        {/* Quantity Stepper */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-900">
                          <span className="text-[11px] text-stone-500">
                            {isRtl ? 'الكمية' : 'Quantity'}
                          </span>
                          <div className="flex items-center border border-stone-800 rounded-lg bg-stone-900 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="px-2.5 py-1 text-stone-400 hover:text-white transition-colors text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-1 text-stone-100 font-mono font-bold text-xs tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="px-2.5 py-1 text-stone-400 hover:text-white transition-colors text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {cart.length > 0 && (
                <div className="p-6 bg-stone-950 border-t border-stone-800 space-y-3">
                  <div className="space-y-1.5 text-xs text-stone-400">
                    <div className="flex justify-between">
                      <span>{t.cart.subtotal}</span>
                      <span className="font-mono tabular-nums text-stone-200">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.cart.vat}</span>
                      <span className="font-mono tabular-nums text-stone-400">
                        {formatCurrency(vat)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-stone-100 pt-2 border-t border-stone-850">
                      <span>{t.cart.total}</span>
                      <span className="font-mono tabular-nums text-amber-400 font-black">
                        {formatCurrency(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={submitSimulatedOrder}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    {t.cart.checkoutSimulate}
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
