import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_BRANCHES } from '../data/mockData';
import { Branch } from '../types';
import { MapPin, Clock, Phone, Navigation, Car, Users, Sun, CheckCircle2 } from 'lucide-react';

export const LocationsSection: React.FC = () => {
  const { language, t, isRtl } = useLanguage();
  const [activeBranchId, setActiveBranchId] = useState<string>(MOCK_BRANCHES[0].id);
  const [directionsNotice, setDirectionsNotice] = useState<string | null>(null);

  const activeBranch = MOCK_BRANCHES.find(b => b.id === activeBranchId) || MOCK_BRANCHES[0];

  const handleDirectionsClick = (branch: Branch) => {
    setDirectionsNotice(
      language === 'ar'
        ? `تم فتح مسار الملاحة التجريبي إلى ${branch.name.ar} (مسافة تقديرية 4.2 كم - 9 دقائق)`
        : `GPS Route Simulated to ${branch.name.en} (Est. Distance 4.2 km · 9 min drive)`
    );
    setTimeout(() => {
      setDirectionsNotice(null);
    }, 4000);
  };

  return (
    <section id="locations" className="py-24 bg-stone-950 border-t border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase block mb-2">
            {t.locations.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-100 font-display tracking-tight">
            {t.locations.title}
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            {t.locations.description}
          </p>
        </div>

        {/* Directions toast */}
        {directionsNotice && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl text-amber-300 text-xs flex items-center gap-3 animate-fade-in">
            <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{directionsNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 5 Columns: Branch List & Selector Cards */}
          <div className="lg:col-span-5 space-y-4">
            {MOCK_BRANCHES.map(branch => {
              const isSelected = activeBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => setActiveBranchId(branch.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 border-amber-500/70 shadow-lg shadow-amber-500/10'
                      : 'bg-stone-950 border-stone-850 hover:border-stone-750'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-400'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-100 text-sm">
                          {branch.name[language]}
                        </h3>
                        <span className="text-xs text-amber-400 font-medium">
                          {branch.city[language]}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-stone-500 shrink-0">
                      {branch.deliveryTime}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 mb-3 pl-10 rtl:pl-0 rtl:pr-10">
                    {branch.address[language]}
                  </p>

                  <div className="pl-10 rtl:pl-0 rtl:pr-10 pt-2 border-t border-stone-850/80 flex flex-wrap items-center gap-3 text-xs text-stone-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{branch.hours[language]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 7 Columns: Stylized Interactive Visual Map Canvas */}
          <div className="lg:col-span-7 bg-stone-900/60 border border-stone-850 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full min-h-[460px]">
            
            {/* Visual Map Canvas Simulation */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-inner flex items-center justify-center">
              
              {/* Map grid lines */}
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px), radial-gradient(#d97706 1px, #0c0a09 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Highway / street lines vector art */}
              <svg className="absolute inset-0 w-full h-full stroke-stone-800/80 fill-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 100 Q 200 120 400 80 T 800 140" strokeWidth="3" />
                <path d="M 120 0 Q 180 180 220 300" strokeWidth="2" strokeDasharray="6 4" />
                <path d="M 320 0 Q 300 150 420 300" strokeWidth="4" />
                <path d="M 0 220 Q 300 240 700 200" strokeWidth="2" />
              </svg>

              {/* Branch Markers */}
              {MOCK_BRANCHES.map(b => {
                const isCurrent = b.id === activeBranch.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setActiveBranchId(b.id)}
                    style={{ left: `${b.coordinates.x}%`, top: `${b.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl flex flex-col items-center group transition-transform cursor-pointer ${
                      isCurrent ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shadow-xl flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/30'
                        : 'bg-stone-900 border border-stone-700 text-stone-300'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded shadow ${
                      isCurrent ? 'bg-stone-900 text-amber-400 border border-amber-500/40' : 'bg-stone-950/80 text-stone-300'
                    }`}>
                      {b.city[language]}
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-[10px] text-stone-500 font-mono bg-stone-950/80 px-2 py-1 rounded border border-stone-800">
                {t.locations.simulatedMapTitle}
              </div>
            </div>

            {/* Active Branch Detail Drawer */}
            <div className="mt-6 pt-6 border-t border-stone-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-100 text-base">
                    {activeBranch.name[language]}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1 font-mono text-amber-400">
                    <Phone className="w-3.5 h-3.5" />
                    {activeBranch.phone}
                  </span>
                  <span>·</span>
                  <span>{activeBranch.deliveryTime}</span>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {activeBranch.driveThru && (
                    <span className="flex items-center gap-1 text-[11px] text-stone-300 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800">
                      <Car className="w-3 h-3 text-amber-400" />
                      <span>{t.locations.driveThruTag}</span>
                    </span>
                  )}
                  {activeBranch.terraceSeating && (
                    <span className="flex items-center gap-1 text-[11px] text-stone-300 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800">
                      <Sun className="w-3 h-3 text-amber-400" />
                      <span>{t.locations.terraceTag}</span>
                    </span>
                  )}
                  {activeBranch.familySections && (
                    <span className="flex items-center gap-1 text-[11px] text-stone-300 bg-stone-950 px-2.5 py-1 rounded-md border border-stone-800">
                      <Users className="w-3 h-3 text-amber-400" />
                      <span>{t.locations.familyTag}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleDirectionsClick(activeBranch)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.locations.getDirections}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
