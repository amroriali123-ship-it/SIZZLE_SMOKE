import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Flame, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-100 border-t border-stone-200 pt-16 pb-12 text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-200">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-stone-900">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="font-display font-black text-xl tracking-tight uppercase text-stone-950">
                {language === 'ar' ? 'سيزل آند سموك' : 'SIZZLE & SMOKE'}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            <div className="text-xs text-amber-700 font-mono font-medium">
              100% Angus Beef · Daily Brioche · Fire Seared
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#story" className="hover:text-amber-600 transition-colors">
                  {t.nav.about}
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-600 transition-colors">
                  {t.nav.menu}
                </a>
              </li>
              <li>
                <a href="#reservation" className="hover:text-amber-600 transition-colors">
                  {t.nav.reservation}
                </a>
              </li>
              <li>
                <a href="#locations" className="hover:text-amber-600 transition-colors">
                  {t.nav.locations}
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-600 transition-colors">
                  {t.nav.reviews}
                </a>
              </li>
              <li>
                <a href="#admin" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">
                  {language === 'ar' ? '🔐 لوحة تحكم المشرف' : '🔐 Admin Dashboard'}
                </a>
              </li>
            </ul>
          </div>

          {/* Locations & Times */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {t.footer.branchesLink}
            </h4>
            <div className="space-y-2 text-xs text-stone-600">
              <div>
                <span className="font-semibold text-stone-800 block">
                  {language === 'ar' ? 'الرياض - طريق الأمير تركي الأول' : 'Riyadh - Prince Turki 1st Rd'}
                </span>
                <span className="font-mono text-stone-500">12:00 PM - 03:00 AM</span>
              </div>
              <div>
                <span className="font-semibold text-stone-800 block">
                  {language === 'ar' ? 'جدة - الكورنيش الشمالي' : 'Jeddah - North Corniche'}
                </span>
                <span className="font-mono text-stone-500">01:00 PM - 03:30 AM</span>
              </div>
              <div>
                <span className="font-semibold text-stone-800 block">
                  {language === 'ar' ? 'الخبر - الواجهة البحرية' : 'Khobar - Waterfront'}
                </span>
                <span className="font-mono text-stone-500">12:30 PM - 02:30 AM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>{t.footer.rights}</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-600 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <span>{language === 'ar' ? 'العودة للأعلى' : 'Back to top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
