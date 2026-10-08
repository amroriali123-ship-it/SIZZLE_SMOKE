import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Flame, ShoppingBag, Calendar, Languages, Menu as MenuIcon, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.about, href: '#story' },
    { label: t.nav.menu, href: '#menu' },
    { label: t.nav.reservation, href: '#reservation' },
    { label: t.nav.locations, href: '#locations' },
    { label: t.nav.reviews, href: '#reviews' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-stone-950/95 backdrop-blur-md border-b border-stone-800 shadow-xl py-3.5'
          : 'bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Single Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-stone-100 hover:text-amber-400 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-stone-950 text-stone-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight uppercase leading-none">
                {language === 'ar' ? 'سيزل آند سموك' : 'SIZZLE & SMOKE'}
              </span>
              <span className="text-[10px] text-amber-400 font-medium tracking-wider">
                {language === 'ar' ? 'برجر & مشويات حرفية' : 'CRAFT FAST FOOD & GRILL'}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-amber-400 transition-colors py-1 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-stone-900 border border-stone-800 text-stone-200 hover:text-amber-400 hover:border-stone-700 transition-all cursor-pointer"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Languages className="w-4 h-4 text-amber-400" />
              <span className="whitespace-nowrap uppercase tracking-wider">
                {language === 'ar' ? 'English' : 'عربي'}
              </span>
            </button>

            {/* Cart / Tray Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              type="button"
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-900 border border-stone-800 text-stone-200 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline whitespace-nowrap">{t.nav.tray}</span>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[11px] flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Quick Table Reserve CTA */}
            <a
              href="#reservation"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.nav.bookTable}</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-stone-200 hover:bg-stone-800 hover:text-amber-400 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-800">
              <a
                href="#reservation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.nav.bookTable}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
