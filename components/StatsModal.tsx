import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { X } from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { playSoftClick } from '../utils/soundEffects';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  budget: number;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, expenses, budget }) => {
  if (!isOpen) return null;

  // Aggregate data
  const dataMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const data = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value,
  })).filter(item => item.value > 0);

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  const handleClose = () => {
    playSoftClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#5D4037]">Monthly Breakdown</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <X size={24} />
          </button>
        </div>

        {data.length > 0 ? (
          <>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as ExpenseCategory]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#5D4037', fontWeight: 600 }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 mt-4">
               {data.sort((a,b) => b.value - a.value).map(item => (
                 <div key={item.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.name as ExpenseCategory]}}></div>
                        <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#5D4037]">${item.value.toFixed(2)}</span>
                 </div>
               ))}
               <div className="border-t border-gray-100 my-2 pt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total Spent</span>
                    <span className="font-bold text-xl text-[#5D4037]">${totalSpent.toFixed(2)}</span>
               </div>
            </div>
          </>
        ) : (
          <div className="h-40 flex items-center justify-center text-gray-400 text-center flex-col">
            <p className="mb-2">No expenses yet!</p>
            <p className="text-xs">Tap the + button to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsModal;