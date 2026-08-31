import React from 'react';
import { TrendingUp, Clock, Award } from 'lucide-react';

interface MamaMetricsCardProps {
  completionPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
  totalFocusMinutes: number;
  pointsBalance: number;
  childName: string;
}

export const MamaMetricsCard: React.FC<MamaMetricsCardProps> = ({
  completionPercentage,
  completedTasksCount,
  totalTasksCount,
  totalFocusMinutes,
  pointsBalance,
  childName
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      
      {/* % Cumplimiento */}
      <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm flex items-center gap-3">
        <div className="bg-purple-100 text-purple-700 p-3 rounded-2xl shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cumplimiento Hoy</div>
          <div className="text-xl font-black text-slate-800">{completionPercentage}% ({completedTasksCount}/{totalTasksCount})</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5 border">
            <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Tiempo de Enfoque */}
      <div className="bg-white rounded-3xl p-4 border border-teal-100 shadow-sm flex items-center gap-3">
        <div className="bg-teal-100 text-teal-700 p-3 rounded-2xl shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enfoque Programado</div>
          <div className="text-xl font-black text-slate-800">{totalFocusMinutes} min totales</div>
          <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Desglosado en pasos cortos</p>
        </div>
      </div>

      {/* Saldo de Estrellas */}
      <div className="bg-white rounded-3xl p-4 border border-amber-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-800 p-3 rounded-2xl shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Puntos de {childName}</div>
            <div className="text-xl font-black text-amber-900">{pointsBalance} pts</div>
          </div>
        </div>
      </div>

    </div>
  );
};
