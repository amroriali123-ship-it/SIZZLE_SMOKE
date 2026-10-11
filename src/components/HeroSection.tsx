import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_IMAGE } from '../data/mockData';
import { ArrowLeft, ArrowRight, Utensils, Calendar, Clock, Star, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-50 to-stone-50">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Zero-Pill Unboxed Text Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-700 tracking-wide">
              <span>100% Black Angus</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Daily Butter Brioche</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>400° Fire Sear</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] max-w-2xl" style={{ textWrap: 'balance' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500">
                {t.hero.titleHighlight}
              </span>{' '}
              {t.hero.titleRest}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-650 text-stone-600 leading-relaxed max-w-xl">
              {t.hero.description}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#menu"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>{t.hero.exploreMenu}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>

              <a
                href="#reservation"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-sm shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{t.hero.reserveTable}</span>
              </a>
            </div>

            {/* Halal and Fresh Trust Guarantee */}
            <div className="flex items-center gap-2 text-xs text-stone-500 pt-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.hero.halalGuarantee}</span>
            </div>

            {/* Adjacent Social Proof Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display tabular-nums">
                  1,200+
                </div>
                <div className="text-xs text-stone-500 mt-0.5 leading-snug">
                  {t.hero.statBurgers}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 font-display tabular-nums flex items-center gap-1">
                  <span>6-8</span>
                  <Clock className="w-4 h-4 text-amber-600 inline" />
                </div>
                <div className="text-xs text-stone-500 mt-0.5 leading-snug">
                  {t.hero.statPrep}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900 font-display tabular-nums flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 inline" />
                </div>
                <div className="text-xs text-stone-500 mt-0.5 leading-snug">
                  {t.hero.statRating}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Warm glow aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-orange-300/20 to-transparent rounded-3xl blur-2xl transform scale-95" />
              
              {/* Card Container with Image */}
              <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 bg-white shadow-xl group">
                <img
                  src={HERO_IMAGE}
                  alt="Gourmet double smash burger sizzling on charcoal slate"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                {/* Bottom Card Spotlight Info */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between text-white">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-1">
                      {isRtl ? 'الأكثر طلباً وتفضيلاً' : 'Chef Signature Sensation'}
                    </div>
                    <div className="font-bold text-white text-lg leading-tight">
                      {isRtl ? 'برجر لافا سماش المزدوج' : 'Double Lava Ember Smash'}
                    </div>
                    <div className="text-xs text-stone-200 mt-0.5 flex items-center gap-2">
                      <span className="font-mono tabular-nums text-amber-300 font-bold">38 SAR</span>
                      <span>·</span>
                      <span>780 kcal</span>
                    </div>
                  </div>

                  <a
                    href="#menu"
                    className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md transition-transform hover:scale-110"
                    title={t.menu.addToTray}
                  >
                    <Utensils className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
