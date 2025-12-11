import React, { useState, useEffect, useMemo } from 'react';
import { Plus, PieChart as PieIcon, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import CatMascot from './components/CatMascot';
import ProgressBar from './components/ProgressBar';
import ExpenseForm from './components/ExpenseForm';
import StatsModal from './components/StatsModal';
import { Expense, CatPattern, UserStats, CatAccessory, LEVEL_THRESHOLDS, ACCESSORY_UNLOCKS, ExpenseCategory } from './types';
import { COLORS, CAT_STYLES } from './constants';

function App() {
  // --- State ---
  const [budget, setBudget] = useState(2000);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isStatsModalOpen, setStatsModalOpen] = useState(false);
  
  // Cat State
  const [catPattern, setCatPattern] = useState<CatPattern>('calico');
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [selectedAccessory, setSelectedAccessory] = useState<CatAccessory>('none');
  
  // User Progression
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    lastLogDate: null
  });

  const [notification, setNotification] = useState<string | null>(null);

  const patterns: CatPattern[] = ['calico', 'oddeye', 'ragdoll', 'lihua'];

  // --- Derived State ---
  const totalSpent = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const isOverBudget = totalSpent > budget;

  // Unlocked Accessories
  const unlockedAccessories: CatAccessory[] = useMemo(() => {
    const unlocked = new Set<CatAccessory>(['none']);
    for (let i = 1; i <= userStats.level; i++) {
        if (ACCESSORY_UNLOCKS[i]) unlocked.add(ACCESSORY_UNLOCKS[i]);
    }
    return Array.from(unlocked);
  }, [userStats.level]);

  // Use selected accessory if valid, otherwise fallback to highest level or none
  const activeAccessory = useMemo(() => {
      if (unlockedAccessories.includes(selectedAccessory)) {
          return selectedAccessory;
      }
      return unlockedAccessories[unlockedAccessories.length - 1];
  }, [selectedAccessory, unlockedAccessories]);

  // Cat Mood
  const catMood = useMemo(() => {
    if (isOverBudget) return 'angry';
    if (userStats.streak >= 3 && totalSpent < budget * 0.8) return 'happy';
    return 'neutral';
  }, [isOverBudget, userStats.streak, totalSpent, budget]);

  // --- Effects ---

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('purrfect-data');
    if (saved) {
      const data = JSON.parse(saved);
      setBudget(data.budget || 2000);
      setExpenses(data.expenses || []);
      setUserStats(data.userStats || { xp: 0, level: 1, streak: 0, lastLogDate: null });
      setCatPattern(data.catPattern || 'calico');
      setSelectedAccessory(data.selectedAccessory || 'none');
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('purrfect-data', JSON.stringify({
      budget,
      expenses,
      userStats,
      catPattern,
      selectedAccessory
    }));
  }, [budget, expenses, userStats, catPattern, selectedAccessory]);

  // Handle Level Up
  useEffect(() => {
    const nextLevelXp = LEVEL_THRESHOLDS[userStats.level];
    if (nextLevelXp && userStats.xp >= nextLevelXp) {
        setUserStats(prev => ({ ...prev, level: prev.level + 1 }));
        const newAccessory = ACCESSORY_UNLOCKS[userStats.level + 1];
        if (newAccessory) {
             showNotification(`Level Up! Unlocked: ${newAccessory}!`);
             setSelectedAccessory(newAccessory); // Auto-equip new item
        } else {
             showNotification(`Level Up! You are level ${userStats.level + 1}!`);
        }
    }
  }, [userStats.xp, userStats.level]);


  // --- Handlers ---

  const handleAddExpense = (amount: number, category: ExpenseCategory, note: string) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      category,
      note,
      date: new Date().toISOString()
    };

    setExpenses(prev => [newExpense, ...prev]);

    // Update Stats
    const today = new Date().toISOString().split('T')[0];
    const lastLog = userStats.lastLogDate ? userStats.lastLogDate.split('T')[0] : null;
    
    let newStreak = userStats.streak;
    let xpGain = 10; // Base XP for logging

    if (lastLog !== today) {
        // Daily login/log bonus
        if (lastLog && new Date(today).getTime() - new Date(lastLog).getTime() <= 86400000) {
            newStreak += 1; // Consecutive day
            xpGain += 20;
        } else if (lastLog && new Date(today).getTime() - new Date(lastLog).getTime() > 86400000) {
            newStreak = 1; // Broken streak
        } else {
            newStreak = 1; // First day
        }
    }

    if (!isOverBudget) {
        xpGain += 5;
    }

    setUserStats(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        streak: newStreak,
        lastLogDate: new Date().toISOString()
    }));
  };

  const cycleCatPattern = () => {
    const nextIndex = (currentPatternIndex + 1) % patterns.length;
    setCurrentPatternIndex(nextIndex);
    setCatPattern(patterns[nextIndex]);
  };

  const cycleAccessory = () => {
    const currentIndex = unlockedAccessories.indexOf(activeAccessory);
    const nextIndex = (currentIndex + 1) % unlockedAccessories.length;
    setSelectedAccessory(unlockedAccessories[nextIndex]);
  };

  const showNotification = (msg: string) => {
      setNotification(msg);
      setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#5D4037] font-sans flex flex-col items-center relative overflow-hidden">
      
      {/* Top Section: Budget Stats */}
      <header className="w-full max-w-md px-6 pt-8 pb-4 z-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50/50">
          <div className="flex justify-between items-end mb-1">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Monthly Budget</p>
              <div className="flex items-center text-2xl font-bold text-[#5D4037]">
                <span>$</span>
                <input 
                  type="number" 
                  value={budget} 
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="bg-transparent w-24 focus:outline-none focus:border-b-2 border-[#E6A4B4]"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Spent</p>
              <p className={`text-2xl font-bold ${isOverBudget ? 'text-[#E58F8F]' : 'text-[#5D4037]'}`}>
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
          
          <ProgressBar current={totalSpent} max={budget} />
          
          <div className="flex justify-between mt-2 text-xs font-medium text-gray-400">
             <span>Level {userStats.level}</span>
             <span>Streak: {userStats.streak} 🔥</span>
          </div>
        </div>
      </header>

      {/* Main Content: Cat & Interaction */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 relative z-0">
        
        {/* Level Progress Circle Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-4 border-white/40 z-[-1]" />
        
        <div className="relative">
            <CatMascot 
                pattern={catPattern} 
                accessory={activeAccessory} 
                mood={catMood}
                onClick={() => {}}
            />
            
            {/* Customization Controls */}
            {/* Right Side: Change Cat */}
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 flex flex-col gap-2">
                <button 
                    onClick={cycleCatPattern}
                    className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-orange-50 transition-colors"
                    title="Change Cat"
                >
                   <ChevronRight size={20} className="text-gray-400" />
                </button>
            </div>

            {/* Left Side: Change Accessory */}
             <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex flex-col gap-2">
                <button 
                    onClick={cycleAccessory}
                    className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-orange-50 transition-colors"
                    title="Change Accessory"
                >
                   <Sparkles size={20} className="text-[#E6A4B4]" />
                </button>
            </div>
        </div>

        {/* Status Text & Name */}
        <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-[#5D4037] mb-1">{CAT_STYLES[catPattern].characterName}</h2>
            <div className="h-6">
                {notification ? (
                    <div className="text-[#E6A4B4] font-bold animate-bounce text-sm">
                        {notification}
                    </div>
                ) : (
                    <p className="text-sm font-medium opacity-60">
                        {isOverBudget ? "Oh no! We're over budget!" : "Keep it up! We're doing great!"}
                    </p>
                )}
            </div>
        </div>

      </main>

      {/* Bottom Actions */}
      <footer className="w-full max-w-md px-6 pb-8 pt-4 flex items-center justify-between gap-4 z-10">
        
        <button 
            onClick={() => setStatsModalOpen(true)}
            className="flex-1 h-16 bg-white rounded-2xl shadow-sm border border-orange-50 flex items-center justify-center gap-2 text-[#5D4037] font-bold hover:bg-gray-50 transition-transform active:scale-95"
        >
            <div className="bg-[#E7F3EF] p-2 rounded-full text-[#5CA988]">
                <PieIcon size={20} />
            </div>
            <span className="text-sm">Stats</span>
        </button>

        <button 
            onClick={() => setExpenseModalOpen(true)}
            className="w-20 h-20 bg-[#5D4037] rounded-full shadow-lg shadow-[#5d40374d] flex items-center justify-center text-white hover:bg-[#4A332C] transition-transform active:scale-90 -mt-8 border-4 border-[#FDF8F5]"
        >
            <Plus size={36} strokeWidth={3} />
        </button>

        <button 
            className="flex-1 h-16 bg-white rounded-2xl shadow-sm border border-orange-50 flex items-center justify-center gap-2 text-[#5D4037] font-bold hover:bg-gray-50 transition-transform active:scale-95 opacity-50 cursor-not-allowed"
            title="Coming Soon"
        >
             <div className="bg-[#FFF8E1] p-2 rounded-full text-[#FFB300]">
                <Trophy size={20} />
            </div>
            <span className="text-sm">Goals</span>
        </button>

      </footer>

      {/* Modals */}
      <ExpenseForm 
        isOpen={isExpenseModalOpen} 
        onClose={() => setExpenseModalOpen(false)} 
        onSubmit={handleAddExpense}
      />

      <StatsModal 
        isOpen={isStatsModalOpen}
        onClose={() => setStatsModalOpen(false)}
        expenses={expenses}
        budget={budget}
      />
      
    </div>
  );
}

export default App;