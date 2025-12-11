import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORIES, ExpenseCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, category: ExpenseCategory, note: string) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      onSubmit(val, category, note);
      setAmount('');
      setNote('');
      setCategory('Food');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#5D4037]">Add Expense</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-[#FDF8F5] border border-[#E8D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6A4B4] text-lg font-bold text-[#5D4037]"
                    placeholder="0.00"
                    autoFocus
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                    category === cat 
                      ? 'ring-2 ring-offset-1 ring-gray-300 scale-105 shadow-sm' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: CATEGORY_COLORS[cat], color: '#4A3B32' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-[#FDF8F5] border border-[#E8D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E6A4B4] text-sm"
              placeholder="What was it for?"
            />
          </div>

          <button
            type="submit"
            disabled={!amount}
            className="w-full py-3 bg-[#5D4037] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#4A332C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            <Check size={20} />
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
