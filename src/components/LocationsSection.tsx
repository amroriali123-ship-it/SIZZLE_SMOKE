import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_BRANCHES } from '../data/mockData';
import { Branch } from '../types';
import { MapPin, Clock, Phone, Navigation, Car, Users, Sun } from 'lucide-react';

export const LocationsSection: React.FC = () => {
  const { language, t } = useLanguage();
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
    <section id="locations" className="py-24 bg-white border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold tracking-widest text-amber-600 uppercase block mb-2">
            {t.locations.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight">
            {t.locations.title}
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            {t.locations.description}
          </p>
        </div>

        {/* Directions toast */}
        {directionsNotice && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center gap-3 animate-fade-in shadow-xs">
            <Navigation className="w-4 h-4 text-amber-600 shrink-0" />
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
                      ? 'bg-amber-50/80 border-amber-400 shadow-md shadow-amber-500/10'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 text-white' : 'bg-white text-stone-600 border border-stone-200'
                      }`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm">
                          {branch.name[language]}
                        </h3>
                        <span className="text-xs text-amber-700 font-semibold">
                          {branch.city[language]}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-stone-500 shrink-0">
                      {branch.deliveryTime}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-3 pl-10 rtl:pl-0 rtl:pr-10">
                    {branch.address[language]}
                  </p>

                  <div className="pl-10 rtl:pl-0 rtl:pr-10 pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{branch.hours[language]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 7 Columns: Stylized Interactive Visual Map Canvas */}
          <div className="lg:col-span-7 bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full min-h-[460px] shadow-xs">
            
            {/* Visual Map Canvas Simulation */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-inner flex items-center justify-center">
              
              {/* Map grid lines */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px), radial-gradient(#d97706 1px, #fafaf9 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Highway / street lines vector art */}
              <svg className="absolute inset-0 w-full h-full stroke-stone-300 fill-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 100 Q 200 120 400 80 T 800 140" strokeWidth="4" />
                <path d="M 120 0 Q 180 180 220 300" strokeWidth="2.5" strokeDasharray="6 4" />
                <path d="M 320 0 Q 300 150 420 300" strokeWidth="5" />
                <path d="M 0 220 Q 300 240 700 200" strokeWidth="3" />
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
                    <div className={`p-2.5 rounded-xl shadow-md flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-300/60'
                        : 'bg-white border border-stone-300 text-stone-700'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded shadow-xs ${
                      isCurrent ? 'bg-amber-50 text-amber-800 border border-amber-300' : 'bg-white text-stone-700 border border-stone-200'
                    }`}>
                      {b.city[language]}
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-[10px] text-stone-500 font-mono bg-white/90 px-2 py-1 rounded border border-stone-200 shadow-xs">
                {t.locations.simulatedMapTitle}
              </div>
            </div>

            {/* Active Branch Detail Drawer */}
            <div className="mt-6 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-900 text-base">
                    {activeBranch.name[language]}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-600">
                  <span className="flex items-center gap-1 font-mono text-amber-600 font-semibold">
                    <Phone className="w-3.5 h-3.5" />
                    {activeBranch.phone}
                  </span>
                  <span>·</span>
                  <span>{activeBranch.deliveryTime}</span>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {activeBranch.driveThru && (
                    <span className="flex items-center gap-1 text-[11px] text-stone-700 bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-xs">
                      <Car className="w-3 h-3 text-amber-600" />
                      <span>{t.locations.driveThruTag}</span>
                    </span>
                  )}
                  {activeBranch.terraceSeating && (
                    <span className="flex items-center gap-1 text-[11px] text-stone-700 bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-xs">
                      <Sun className="w-3 h-3 text-amber-600" />
                      <span>{t.locations.terraceTag}</span>
                    </span>
                  )}
                  {activeBranch.familySections && (
                    <span className="flex items-center gap-1 text-[11px] text-stone-700 bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-xs">
                      <Users className="w-3 h-3 text-amber-600" />
                      <span>{t.locations.familyTag}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleDirectionsClick(activeBranch)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
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
