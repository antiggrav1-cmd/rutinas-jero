import React from 'react';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { Task } from '../../types';
import { formatDueTime } from '../../utils/dateUtils';

interface MamaExpiredTasksReviewProps {
  expiredTasks: Task[];
  overdueTasks: Task[];
  childName: string;
  onApplyPenalty: (taskId: string, title: string, points?: number) => void;
  onApplyOverduePenalty: (taskId: string, title: string, points?: number) => void;
  onForgive: (taskId: string, title: string) => void;
  onExtendDueTime: (taskId: string, title: string) => void;
}

export const MamaExpiredTasksReview: React.FC<MamaExpiredTasksReviewProps> = ({
  expiredTasks,
  overdueTasks,
  childName,
  onApplyPenalty,
  onApplyOverduePenalty,
  onForgive,
  onExtendDueTime
}) => {
  const totalIssueCount = expiredTasks.length + overdueTasks.length;

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 flex items-start gap-3.5">
        <div className="bg-rose-500 text-white p-2.5 rounded-2xl shrink-0 shadow-md">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-black text-rose-950">Sistema de Penalizaciones y Consecuencias</h3>
          <p className="text-xs text-rose-800 mt-1 leading-relaxed">
            Aquí puedes gestionar las tareas que superaron la hora límite hoy o no se completaron. 
            Al aplicar una penalización se descuentan puntos del saldo de {childName} y se le envía un mensaje motivador para que aprenda de la consecuencia.
          </p>
        </div>
      </div>

      {totalIssueCount === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">¡Todo al día y en orden! 🎉</h4>
          <p className="text-xs text-slate-500 mt-1">No hay tareas con hora límite superada hoy ni tareas vencidas pendientes de decisión.</p>
        </div>
      ) : (
        <>
          {/* SECCIÓN 1: TAREAS CON HORA LÍMITE SUPERADA HOY */}
          {overdueTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>⏰ Superaron la Hora Límite Hoy ({overdueTasks.length})</span>
                </h4>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  Requiere atención
                </span>
              </div>

              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl p-5 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800">{task.title}</span>
                        <span className="text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full">
                          Límite: {formatDueTime(task.dueTime)}
                        </span>
                      </div>
                      {task.description && <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>}
                      <div className="text-xs text-rose-700 font-semibold mt-1">
                        Premio previsto: +{task.rewardPoints} pts • Tiempo est: {task.estimatedMinutes} min
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => onApplyOverduePenalty(task.id, task.title, 10)}
                        className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-1"
                      >
                        <span>📉 Penalizar (-10 pts)</span>
                      </button>
                      <button
                        onClick={() => onExtendDueTime(task.id, task.title)}
                        className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-2xl border border-slate-200 transition flex items-center justify-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>⏳ Dar más tiempo</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: TAREAS EXPIRADAS DE DÍAS ANTERIORES */}
          {expiredTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>⚠️ Tareas No Realizadas de Días Anteriores ({expiredTasks.length})</span>
                </h4>
              </div>

              <div className="space-y-3">
                {expiredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div>
                      <div className="font-extrabold text-sm text-slate-800">{task.title}</div>
                      {task.description && <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>}
                      <div className="text-xs text-slate-500 font-medium mt-1">
                        {task.estimatedMinutes} min • {task.rewardPoints} pts asignados
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => onApplyPenalty(task.id, task.title, 10)}
                        className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition"
                      >
                        📉 Penalizar (-10 pts)
                      </button>
                      <button
                        onClick={() => onForgive(task.id, task.title)}
                        className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-300 transition"
                      >
                        🤝 Justificar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
