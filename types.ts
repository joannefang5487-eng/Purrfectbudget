export type CatPattern = 'calico' | 'oddeye' | 'ragdoll' | 'lihua';
export type CatAccessory = 
  | 'none' 
  | 'scarf' 
  | 'hat' 
  | 'glasses' 
  | 'bow' 
  | 'carrot_hoodie' 
  | 'dino_hoodie' 
  | 'rabbit_hoodie' 
  | 'ribbon_red' 
  | 'ribbon_blue' 
  | 'ribbon_white' 
  | 'ribbon_black' 
  | 'ribbon_pink';

export type ExpenseCategory = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  date: string; // ISO string
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastLogDate: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

export const CATEGORIES: ExpenseCategory[] = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

// XP Thresholds - Extended for more levels
export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500]; 

export const ACCESSORY_UNLOCKS: Record<number, CatAccessory> = {
  1: 'none',
  2: 'ribbon_pink',
  3: 'ribbon_blue',
  4: 'glasses',
  5: 'ribbon_white',
  6: 'scarf',
  7: 'ribbon_red',
  8: 'hat',
  9: 'ribbon_black',
  10: 'carrot_hoodie',
  11: 'dino_hoodie',
  12: 'rabbit_hoodie',
};
