import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AMBIANCE_IMAGE } from '../data/mockData';
import { Flame, Sparkles, ChefHat, Users, CheckCircle2 } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const features = [
    {
      title: t.story.feature1Title,
      description: t.story.feature1Desc,
      icon: Flame,
    },
    {
      title: t.story.feature2Title,
      description: t.story.feature2Desc,
      icon: Sparkles,
    },
    {
      title: t.story.feature3Title,
      description: t.story.feature3Desc,
      icon: ChefHat,
    },
    {
      title: t.story.feature4Title,
      description: t.story.feature4Desc,
      icon: Users,
    },
  ];

  return (
    <section id="story" className="py-24 bg-stone-950 border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase block mb-2">
            {t.story.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-100 font-display tracking-tight leading-tight">
            {t.story.title}
          </h2>
          <p className="mt-4 text-stone-400 text-base sm:text-lg leading-relaxed">
            {t.story.description}
          </p>
        </div>

        {/* Story Grid with Visual Asset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Showcase (Restaurant Interior & Open Kitchen) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
              <img
                src={AMBIANCE_IMAGE}
                alt="Sizzle & Smoke dining room with open grill kitchen"
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/10] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 inset-x-5 flex items-center justify-between text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{isRtl ? 'مطابخ مفتوحة مع طهي حي مباشر' : 'Open Concept Live Show Kitchen'}</span>
                </div>
                <span className="text-stone-400 font-mono">EST. 2024</span>
              </div>
            </div>
          </div>

          {/* Pillars List */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="space-y-3 group">
                  <div className="w-11 h-11 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 group-hover:border-amber-500/50 group-hover:text-amber-300 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-100 tracking-tight leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
