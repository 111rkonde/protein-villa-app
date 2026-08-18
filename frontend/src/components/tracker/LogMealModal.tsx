import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { trackerService } from '../../services/tracker.service';
import { useToast } from '../../context/ToastContext';
import { Flame, Plus } from 'lucide-react';

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useToast();

  const [mealType, setMealType] = useState<string>('Breakfast');
  const [foodName, setFoodName] = useState<string>('');
  const [proteinGrams, setProteinGrams] = useState<string>('30');
  const [calories, setCalories] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      showToast('Please enter food or supplement item name.', 'warning');
      return;
    }

    const grams = Number(proteinGrams);
    if (isNaN(grams) || grams <= 0) {
      showToast('Please enter a valid protein amount in grams.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await trackerService.logProtein({
        mealType,
        foodName: foodName.trim(),
        proteinGrams: grams,
        calories: calories ? Number(calories) : undefined,
      });
      showToast(`Logged +${grams}g protein! 💪`, 'success');
      setFoodName('');
      setProteinGrams('30');
      setCalories('');
      onSuccess();
      onClose();
    } catch (error) {
      showToast('Failed to log meal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Meal or Supplement Shake">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Meal Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Meal / Timing *
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {['Breakfast', 'Lunch', 'Post-Workout', 'Dinner', 'Snack'].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setMealType(type)}
                className={`py-2 rounded-xl text-xs font-bold transition border ${
                  mealType === type
                    ? 'bg-brand-500 text-black border-brand-400 shadow-neon'
                    : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Food / Item Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Food / Shake Description *
          </label>
          <input
            type="text"
            required
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g. 1 Scoop PV ISO-Gold with 300ml Almond Milk"
            className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Protein in Grams */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Protein (Grams) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={1}
                max={250}
                value={proteinGrams}
                onChange={(e) => setProteinGrams(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-4 pr-8 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-bold"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-bold text-brand-500">
                g
              </span>
            </div>
          </div>

          {/* Calories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Calories (Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={3000}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g. 240"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-xs sm:text-sm pl-4 pr-12 py-3 rounded-xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 font-medium"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-400">
                kcal
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-black font-black text-xs sm:text-sm hover:bg-brand-400 shadow-neon transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Logging...' : 'Add to Daily Log'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
