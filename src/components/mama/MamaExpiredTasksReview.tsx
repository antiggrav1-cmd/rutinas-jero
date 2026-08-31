import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Task } from '../../types';

interface MamaExpiredTasksReviewProps {
  expiredTasks: Task[];
  onApplyPenalty: (taskId: string, title: string) => void;
  onForgive: (taskId: string, title: string) => void;
}

export const MamaExpiredTasksReview: React.FC<MamaExpiredTasksReviewProps> = ({
  expiredTasks,
  onApplyPenalty,
  onForgive
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
          Tareas Vencidas de Ayer ({expiredTasks.length})
        </h3>
      </div>

      {expiredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
          <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500">¡Genial! No hay tareas vencidas pendientes de decisión.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expiredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-3xl p-5 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="font-extrabold text-sm text-slate-800">{task.title}</div>
                {task.description && <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>}
                <div className="text-xs text-rose-700 font-semibold mt-1">
                  {task.estimatedMinutes} min • {task.rewardPoints} pts por entregar
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onApplyPenalty(task.id, task.title)}
                  className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition"
                >
                  📉 Aplicar Consecuencia (-10 pts)
                </button>
                <button
                  onClick={() => onForgive(task.id, task.title)}
                  className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-300 transition"
                >
                  🤝 Justificar Día
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
