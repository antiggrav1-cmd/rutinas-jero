import React from 'react';
import { useAppStore } from '../store/useAppStore';
import type { MoodType } from '../types';
import { Smile, Heart, Sparkles, Meh, BatteryLow, AlertCircle } from 'lucide-react';

const MOOD_OPTIONS: { type: MoodType; emoji: string; label: string; bg: string; text: string; border: string; icon: any }[] = [
  {
    type: 'happy',
    emoji: '😊',
    label: 'Feliz / Motivado',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    icon: Smile
  },
  {
    type: 'calm',
    emoji: '😌',
    label: 'Tranquilo / Enfoque',
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-300',
    icon: Sparkles
  },
  {
    type: 'neutral',
    emoji: '😐',
    label: 'Normal',
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    border: 'border-slate-300',
    icon: Meh
  },
  {
    type: 'tired',
    emoji: '😴',
    label: 'Con Sueño / Cansado',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    icon: BatteryLow
  },
  {
    type: 'anxious',
    emoji: '😟',
    label: 'Abrumado / Con Ruido',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: AlertCircle
  }
];

export const MoodCheckInWidget: React.FC = () => {
  const { settings, setTodayMood } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const currentMood = settings.todayMood?.date === today ? settings.todayMood.mood : null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-teal-100 shadow-sm mb-6 my-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-rose-100 text-rose-600 p-2 rounded-2xl">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-slate-800">
            ¿Cómo te sientes hoy, {settings.childName}?
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Selecciona tu emoción. Mamá podrá verla para acompañarte mejor.
          </p>
        </div>
      </div>

      {/* Selector de Emociones */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-3">
        {MOOD_OPTIONS.map((opt) => {
          const isSelected = currentMood === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => setTodayMood(opt.type)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 active:scale-95 ${
                isSelected
                  ? `${opt.bg} ${opt.text} ${opt.border} ring-2 ring-teal-400 font-bold shadow-md`
                  : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="text-[11px] font-bold text-center leading-tight">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {currentMood && (
        <div className="mt-3 text-center text-xs text-teal-800 font-semibold bg-teal-50 py-2 px-3 rounded-xl border border-teal-200 animate-fade-in">
          ✨ Registrado. ¡Gracias por compartir tu emoción hoy!
        </div>
      )}
    </div>
  );
};
