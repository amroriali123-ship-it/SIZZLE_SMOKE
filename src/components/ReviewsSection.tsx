import React, { useState } from 'react';
import { CustomerReview } from '../types';
import { MOCK_REVIEWS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { Star, ShieldCheck, MessageSquarePlus, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { ReviewModal } from './ReviewModal';

export const ReviewsSection: React.FC = () => {
  const { language, t, isRtl } = useLanguage();

  const [reviews, setReviews] = useState<CustomerReview[]>(MOCK_REVIEWS);
  const [filterRating, setFilterRating] = useState<'all' | '5'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleAddReview = (newReview: CustomerReview) => {
    setReviews([newReview, ...reviews]);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
    }, 4500);
  };

  const filteredReviews = reviews.filter(rev => {
    if (filterRating === '5') return rev.rating === 5;
    return true;
  });

  return (
    <section id="reviews" className="py-24 bg-stone-50 border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Alert on review submitted */}
        {successToast && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs flex items-center justify-between shadow-md animate-bounce">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{t.reviews.successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessToast(false)}
              className="text-stone-500 hover:text-stone-800 text-xs underline"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase block mb-2">
              {t.reviews.subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-display tracking-tight">
              {t.reviews.title}
            </h2>
            <p className="text-sm text-stone-500 mt-2">
              {t.reviews.basedOn}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{t.reviews.leaveReview}</span>
          </button>
        </div>

        {/* Overall Ratings Aggregate Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 sm:p-8 bg-white border border-stone-200 rounded-3xl mb-12 shadow-xs">
          {/* Big Score */}
          <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-stone-100">
            <span className="text-5xl font-black text-stone-900 font-display tabular-nums">
              4.9
            </span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-stone-500 text-center font-medium">
              {t.reviews.overallRating}
            </span>
          </div>

          {/* Sub Score 1: Taste */}
          <div className="flex flex-col justify-center space-y-2 p-2">
            <div className="flex justify-between text-xs text-stone-700">
              <span className="font-medium">{t.reviews.tasteScore}</span>
              <span className="font-mono font-bold text-amber-600 tabular-nums">4.9 / 5.0</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[98%]" />
            </div>
          </div>

          {/* Sub Score 2: Speed */}
          <div className="flex flex-col justify-center space-y-2 p-2">
            <div className="flex justify-between text-xs text-stone-700">
              <span className="font-medium">{t.reviews.speedScore}</span>
              <span className="font-mono font-bold text-amber-600 tabular-nums">4.8 / 5.0</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[96%]" />
            </div>
          </div>

          {/* Sub Score 3: Ambiance */}
          <div className="flex flex-col justify-center space-y-2 p-2">
            <div className="flex justify-between text-xs text-stone-700">
              <span className="font-medium">{t.reviews.cleanlinessScore}</span>
              <span className="font-mono font-bold text-amber-600 tabular-nums">5.0 / 5.0</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[100%]" />
            </div>
          </div>
        </div>

        {/* Filter Controls (All vs 5-Star) */}
        <div className="flex items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setFilterRating('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterRating === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {t.reviews.filterAll} ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRating('5')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterRating === '5'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            {t.reviews.filter5Star}
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 hover:border-amber-300 transition-colors shadow-xs"
            >
              {/* Header: Author & Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold flex items-center justify-center text-xs">
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {rev.authorName[language]}
                      </span>
                      {rev.verifiedDiner && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{t.reviews.verifiedDiner}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-stone-650 text-stone-600 text-xs sm:text-sm leading-relaxed">
                "{rev.comment[language]}"
              </p>

              {/* Favorite Meal Highlight */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-400">{t.reviews.favoriteItemLabel}</span>
                  <span className="text-amber-700 font-semibold">
                    {rev.favoriteItem[language]}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-stone-400">
                  <ThumbsUp className="w-3 h-3" />
                  <span className="text-[11px] font-medium">{isRtl ? 'يوصي به' : 'Recommended'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitReview={handleAddReview}
      />
    </section>
  );
};
