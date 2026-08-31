import React from 'react';
import { Heart } from 'lucide-react';
import type { MoodCheckIn } from '../../types';
import { MOOD_MAP } from '../../constants';

interface MamaMoodIndicatorProps {
  childName: string;
  todayMood?: MoodCheckIn;
}

export const MamaMoodIndicator: React.FC<MamaMoodIndicatorProps> = ({
  childName,
  todayMood
}) => {
  const today = new Date().toISOString().split('T')[0];
  const moodData = todayMood?.date === today ? todayMood : null;

  if (!moodData) {
    return (
      <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 mb-6 flex items-center justify-between text-xs text-purple-900 font-medium">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-purple-500 fill-current" />
          <span>{childName} aún no ha registrado su estado de ánimo hoy.</span>
        </div>
        <span className="text-[11px] text-purple-500 italic">Esperando check-in...</span>
      </div>
    );
  }

  const info = MOOD_MAP[moodData.mood] || MOOD_MAP.neutral;

  return (
    <div className={`${info.bg} border ${info.border} rounded-3xl p-4 mb-6 shadow-sm`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
          <span className="text-2xl">{info.emoji}</span>
          <span>Estado de ánimo de {childName} hoy: <strong className={info.text}>{info.label}</strong></span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200">
          Actualizado hoy
        </span>
      </div>
      <p className={`text-xs ${info.text} font-medium mt-1 pl-8`}>
        💡 <strong>Orientación Cuidador:</strong> {info.tip}
      </p>
    </div>
  );
};
