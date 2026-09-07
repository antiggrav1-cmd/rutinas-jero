import React from 'react';
import { Sparkles, Flame, Trophy } from 'lucide-react';

interface HijoHeaderBannerProps {
  childName: string;
  streakCount: number;
  pointsBalance: number;
}

export const HijoHeaderBanner: React.FC<HijoHeaderBannerProps> = ({
  childName,
  streakCount,
  pointsBalance
}) => {
  return (
    <div className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Modo Enfoque Tranquilo</span>
        </div>
        <h2 className="text-2xl font-black">¡Hola, {childName}! 👋</h2>
        <p className="text-xs text-teal-100 mt-1 max-w-md">
          ¡Enfócate, hazlo bien y sin distraerte! Cumplir tus tareas rápido y completo te da más estrellas y tiempo libre para tus premios.
        </p>
      </div>

      {/* Tally Card de Puntos y Racha */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Card Racha */}
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center gap-2.5">
          <div className="bg-orange-500 text-white p-2.5 rounded-xl shadow-md">
            <Flame className="w-5 h-5 fill-current animate-bounce-short" />
          </div>
          <div>
            <div className="text-[10px] text-teal-100 font-bold uppercase tracking-wider">Racha Consecutiva</div>
            <div className="text-lg font-black text-white">{streakCount || 0} Días 🔥</div>
          </div>
        </div>

        {/* Card Puntos */}
        <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center gap-2.5">
          <div className="bg-amber-400 text-amber-950 p-2.5 rounded-xl shadow-md">
            <Trophy className="w-5 h-5 fill-amber-300 text-amber-500" />
          </div>
          <div>
            <div className="text-[10px] text-teal-100 font-bold uppercase tracking-wider">Tus Puntos</div>
            <div className="text-lg font-black text-white">{pointsBalance} pts</div>
          </div>
        </div>
      </div>
    </div>
  );
};
