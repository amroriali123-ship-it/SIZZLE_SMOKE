import React, { useState } from 'react';
import { CustomerReview } from '../types';
import { MENU_ITEMS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: CustomerReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitReview }) => {
  const { language, t, isRtl } = useLanguage();

  const [authorName, setAuthorName] = useState('');
  const [overallRating, setOverallRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [speedRating, setSpeedRating] = useState(5);
  const [ambianceRating, setAmbianceRating] = useState(5);
  const [favoriteItemId, setFavoriteItemId] = useState(MENU_ITEMS[0].id);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setError(language === 'ar' ? 'يرجى كتابة اسمك وتفاصيل رأيك.' : 'Please provide your name and review comments.');
      return;
    }

    const selectedMeal = MENU_ITEMS.find(m => m.id === favoriteItemId) || MENU_ITEMS[0];
    const initials = authorName.trim().slice(0, 2);

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      authorName: { ar: authorName, en: authorName },
      avatarInitials: initials,
      rating: overallRating,
      foodRating,
      speedRating,
      ambianceRating,
      comment: { ar: comment, en: comment },
      date: new Date().toISOString().split('T')[0],
      favoriteItem: selectedMeal.name,
      verifiedDiner: true,
    };

    onSubmitReview(newReview);
    onClose();
  };

  const StarRatingPicker = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-stone-300 font-medium">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 text-stone-600 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? 'text-amber-400 fill-amber-400' : 'text-stone-700'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 rounded-full bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase block mb-1">
            {t.reviews.subtitle}
          </span>
          <h3 className="text-2xl font-black text-stone-100 font-display">
            {t.reviews.modalTitle}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Author Name */}
          <div>
            <label className="text-xs font-bold text-stone-400 block mb-1">
              {t.reviews.nameLabel}
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={t.reviews.namePlaceholder}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Overall Stars */}
          <div className="p-3 bg-stone-950/70 border border-stone-800/80 rounded-xl">
            <StarRatingPicker
              label={t.reviews.overallStarLabel}
              value={overallRating}
              onChange={setOverallRating}
            />
          </div>

          {/* Sub Criteria */}
          <div className="p-3 bg-stone-950/40 border border-stone-800/60 rounded-xl space-y-1">
            <StarRatingPicker
              label={t.reviews.rateFood}
              value={foodRating}
              onChange={setFoodRating}
            />
            <StarRatingPicker
              label={t.reviews.rateSpeed}
              value={speedRating}
              onChange={setSpeedRating}
            />
            <StarRatingPicker
              label={t.reviews.rateAmbiance}
              value={ambianceRating}
              onChange={setAmbianceRating}
            />
          </div>

          {/* Favorite Dish Selector */}
          <div>
            <label className="text-xs font-bold text-stone-400 block mb-1">
              {t.reviews.favoriteDishLabel}
            </label>
            <select
              value={favoriteItemId}
              onChange={(e) => setFavoriteItemId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              {MENU_ITEMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name[language]}
                </option>
              ))}
            </select>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="text-xs font-bold text-stone-400 block mb-1">
              {t.reviews.reviewCommentLabel}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.reviews.reviewCommentPlaceholder}
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {t.reviews.submitReview}
          </button>
        </form>
      </div>
    </div>
  );
};
