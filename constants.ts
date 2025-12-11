import { CatPattern, ExpenseCategory } from "./types";

export const COLORS = {
  bg: '#FDF8F5',
  card: '#FFF0E5',
  text: '#5D4037',
  accent: '#E6A4B4', // Blush Pink
  success: '#A3C9A8', // Muted Green
  warning: '#F3D19E', // Soft Yellow/Orange
  danger: '#E58F8F', // Soft Red
  barBackground: '#E8D5C8',
};

export const CAT_STYLES: Record<CatPattern, { name: string, characterName: string, colors: any }> = {
  calico: {
    name: 'Calico',
    characterName: 'Nini',
    colors: { base: '#FFFFFF', patch1: '#E6A05C', patch2: '#4A4A4A' }
  },
  oddeye: {
    name: 'Odd-eyed White',
    characterName: 'Nana',
    colors: { base: '#FFFFFF', patch1: '#FFFFFF', patch2: '#FFFFFF' } // Pure white
  },
  ragdoll: {
    name: 'Ragdoll',
    characterName: 'Pertti',
    colors: { base: '#FFFFFF', patch1: '#6D5446', patch2: '#6D5446' } // White with brown points
  },
  lihua: {
    name: 'Li Hua',
    characterName: 'Shnupi',
    colors: { base: '#8D7F75', patch1: '#4F433E', patch2: '#3E3430' } // Brown tabby
  }
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#FFB7B2',
  Transport: '#B5EAD7',
  Shopping: '#E2F0CB',
  Bills: '#FFDAC1',
  Entertainment: '#C7CEEA',
  Other: '#E0E0E0',
};