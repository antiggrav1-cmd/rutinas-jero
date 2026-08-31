import React from 'react';
import type { CategoryType } from '../../types';
import { Sun, Moon, BookOpen, Home, User } from 'lucide-react';

interface HijoCategoryFiltersProps {
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (category: CategoryType | 'all') => void;
}

export const HijoCategoryFilters: React.FC<HijoCategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap border transition ${
          selectedCategory === 'all'
            ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        Todas las Rutinas
      </button>
      <button
        onClick={() => onSelectCategory('routine_morning')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
          selectedCategory === 'routine_morning'
            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
            : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Mañana</span>
      </button>
      <button
        onClick={() => onSelectCategory('routine_night')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
          selectedCategory === 'routine_night'
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
            : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-50'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Noche</span>
      </button>
      <button
        onClick={() => onSelectCategory('school')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
          selectedCategory === 'school'
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Escuela</span>
      </button>
      <button
        onClick={() => onSelectCategory('home')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
          selectedCategory === 'home'
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
            : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Hogar</span>
      </button>
      <button
        onClick={() => onSelectCategory('personal')}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
          selectedCategory === 'personal'
            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
            : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        <span>Cuidado</span>
      </button>
    </div>
  );
};
