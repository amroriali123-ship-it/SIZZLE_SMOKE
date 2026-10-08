import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_IMAGE } from '../data/mockData';
import { ArrowLeft, ArrowRight, Utensils, Calendar, Clock, Star, ShieldCheck } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-radial from-stone-900 via-stone-950 to-stone-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Zero-Pill Unboxed Text Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400/90 tracking-wide">
              <span>100% Black Angus</span>
              <span aria-hidden="true">·</span>
              <span>Daily Butter Brioche</span>
              <span aria-hidden="true">·</span>
              <span>400° Fire Sear</span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-stone-100 tracking-tight leading-[1.1] max-w-2xl" style={{ textWrap: 'balance' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                {t.hero.titleHighlight}
              </span>{' '}
              {t.hero.titleRest}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl">
              {t.hero.description}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#menu"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>{t.hero.exploreMenu}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>

              <a
                href="#reservation"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-stone-700/80 hover:border-amber-500/50 text-stone-100 font-semibold text-sm transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{t.hero.reserveTable}</span>
              </a>
            </div>

            {/* Halal and Fresh Trust Guarantee */}
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.hero.halalGuarantee}</span>
            </div>

            {/* Adjacent Social Proof Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800/80 max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-stone-100 font-display tabular-nums">
                  1,200+
                </div>
                <div className="text-xs text-stone-400 mt-0.5 leading-snug">
                  {t.hero.statBurgers}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display tabular-nums flex items-center gap-1">
                  <span>6-8</span>
                  <Clock className="w-4 h-4 text-amber-400/80 inline" />
                </div>
                <div className="text-xs text-stone-400 mt-0.5 leading-snug">
                  {t.hero.statPrep}
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-stone-100 font-display tabular-nums flex items-center gap-1">
                  <span>4.9</span>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
                </div>
                <div className="text-xs text-stone-400 mt-0.5 leading-snug">
                  {t.hero.statRating}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Flame aura background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/30 via-orange-500/20 to-transparent rounded-3xl blur-2xl transform scale-95" />
              
              {/* Card Container with Image */}
              <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl group">
                <img
                  src={HERO_IMAGE}
                  alt="Gourmet double smash burger sizzling on charcoal slate"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Bottom Card Spotlight Info */}
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
                      {isRtl ? 'الأكثر طلباً وتفضيلاً' : 'Chef Signature Sensation'}
                    </div>
                    <div className="font-bold text-stone-100 text-lg leading-tight">
                      {isRtl ? 'برجر لافا سماش المزدوج' : 'Double Lava Ember Smash'}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono tabular-nums text-amber-300 font-semibold">38 SAR</span>
                      <span>·</span>
                      <span>780 kcal</span>
                    </div>
                  </div>

                  <a
                    href="#menu"
                    className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-lg transition-transform hover:scale-110"
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
