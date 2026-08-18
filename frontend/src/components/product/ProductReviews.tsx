import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquare, ThumbsUp, Send } from 'lucide-react';
import { Review } from '../../types';
import { productService } from '../../services/product.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [reviewsData, setReviewsData] = useState<{
    reviews: Review[];
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
  }>({
    reviews: [],
    total: 0,
    averageRating: 5.0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  const fetchReviews = async () => {
    try {
      const data = await productService.getReviews(productId);
      setReviewsData(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to submit a verified product review.', 'warning');
      return;
    }

    if (comment.trim().length < 5) {
      showToast('Review comment must be at least 5 characters.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.addReview({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });
      showToast('Thank you! Your verified review has been published. ⭐', 'success');
      setTitle('');
      setComment('');
      setShowReviewForm(false);
      await fetchReviews();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white dark:bg-dark-surface p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl">
        {/* Big Rating Average */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800">
          <div className="text-5xl md:text-6xl font-black font-display text-gray-900 dark:text-white">
            {reviewsData.averageRating}
          </div>
          <div className="flex items-center gap-1 text-amber-400 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(reviewsData.averageRating) ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Based on {reviewsData.total} verified customer ratings
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="mt-4 px-5 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs hover:bg-brand-400 shadow-neon transition"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Rating Bar Distribution */}
        <div className="md:col-span-2 space-y-2.5 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviewsData.ratingDistribution[star] || 0;
            const percent = reviewsData.total > 0 ? Math.round((count / reviewsData.total) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 font-bold text-gray-700 dark:text-gray-300">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="w-10 text-right text-gray-400 font-semibold">{percent}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white dark:bg-dark-surface p-6 md:p-8 rounded-3xl border border-brand-500/40 shadow-2xl space-y-4 animate-scale-up"
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-500" />
            Share Your Experience
          </h4>

          {/* Star Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rating ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-amber-400 ml-2">
                {rating === 5 && 'Outstanding ⭐⭐⭐⭐⭐'}
                {rating === 4 && 'Very Good ⭐⭐⭐⭐'}
                {rating === 3 && 'Average ⭐⭐⭐'}
                {rating === 2 && 'Below Average ⭐⭐'}
                {rating === 1 && 'Poor ⭐'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Headline (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best chocolate flavor ever, zero bloating!"
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
              Your Detailed Review *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the mixability, taste, recovery, and overall performance?"
              className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm p-4 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs hover:bg-brand-400 shadow-neon transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Customer Reviews List */}
      <div className="space-y-4">
        {reviewsData.reviews.length > 0 ? (
          reviewsData.reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center font-bold text-black text-sm">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {rev.userName}
                      </span>
                      {rev.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && (
                <div className="font-bold text-sm text-gray-900 dark:text-white">
                  "{rev.title}"
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-slate-800 p-8">
            <p className="text-gray-400 text-sm">No reviews yet for this product. Be the first to share your results!</p>
          </div>
        )}
      </div>
    </div>
  );
};
