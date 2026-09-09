import React, { useState } from 'react';
import type { Task } from '../types';
import { useAppStore } from '../store/useAppStore';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Star, 
  Play, 
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FocusTimer } from './FocusTimer';
import { CATEGORY_CONFIG, DAY_NAMES } from '../constants';
import { notificationService } from '../services/notificationService';
import { isTimePastToday, formatDueTime } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  isMamaRole?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isMamaRole = false }) => {
  const { toggleSubStep, completeTask, deleteTask, approveTaskAndAwardPoints, rejectTaskForRevision } = useAppStore();
  const [showTimer, setShowTimer] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const config = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.custom;
  const CategoryIcon = config.icon;

  const completedSubstepsCount = task.substeps.filter((s) => s.completed).length;
  const totalSubsteps = task.substeps.length;
  const progressPercent = totalSubsteps > 0 ? (completedSubstepsCount / totalSubsteps) * 100 : 0;
  const isCompleted = task.status === 'completed';
  const isOverdue = !isCompleted && task.status !== 'pending_approval' && isTimePastToday(task.dueTime);

  const handleCompleteTask = () => {
    completeTask(task.id);
    notificationService.playSuccessChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const getFrequencyLabel = () => {
    if (task.frequencyType === 'daily') {
      return '🔁 Diaria';
    } else if (task.frequencyType === 'weekly' && task.weeklyDays && task.weeklyDays.length > 0) {
      const days = task.weeklyDays.map(d => DAY_NAMES[d]).join(', ');
      return `📅 ${days}`;
    } else if (task.frequencyType === 'sporadic') {
      return `📍 Puntual${task.sporadicDate ? ` (${task.sporadicDate})` : ''}`;
    }
    return '🔁 Diaria';
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
        isCompleted
          ? 'bg-slate-50/80 border-slate-200 opacity-80'
          : isOverdue
          ? 'bg-rose-50/30 border-rose-300 hover:border-rose-400'
          : 'bg-white border-slate-100 hover:border-teal-200'
      }`}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text} border ${config.border}`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              {config.label}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {task.estimatedMinutes} min
            </span>

            {/* Frequency Badge */}
            <span className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
              {getFrequencyLabel()}
            </span>

            {/* Due Time Reference Badge */}
            {task.dueTime && (
              <span
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  isOverdue
                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
                title={isOverdue ? 'Esta tarea superó la hora límite programada' : 'Hora límite de referencia'}
              >
                {isOverdue ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    <span>⚠️ Límite superado ({formatDueTime(task.dueTime)})</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>Límite: {formatDueTime(task.dueTime)}</span>
                  </>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-amber-100/70 border border-amber-300/60 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-inner">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>+{task.rewardPoints} pts</span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h3
              className={`text-lg font-bold ${
                isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {totalSubsteps > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 font-semibold mb-1.5">
              <span>Sub-pasos completados</span>
              <span className="text-teal-700">
                {completedSubstepsCount} de {totalSubsteps}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {isExpanded && totalSubsteps > 0 && (
        <div className="bg-slate-50/70 border-t border-slate-100 p-4 space-y-2.5">
          {task.substeps.map((substep) => (
            <button
              key={substep.id}
              disabled={isCompleted || task.status === 'pending_approval'}
              onClick={() => toggleSubStep(task.id, substep.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 ${
                substep.completed
                  ? 'bg-teal-50/60 border-teal-200 text-teal-900 shadow-inner'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 shadow-sm'
              }`}
            >
              {substep.completed ? (
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${
                  substep.completed ? 'line-through opacity-75' : ''
                }`}
              >
                {substep.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {showTimer && !isCompleted && (
        <div className="px-4">
          <FocusTimer
            initialMinutes={task.estimatedMinutes}
            taskTitle={task.title}
            onFinish={handleCompleteTask}
            onClose={() => setShowTimer(false)}
          />
        </div>
      )}

      <div className="bg-slate-50/40 p-4 border-t border-slate-100 flex items-center justify-between gap-2">
        {isMamaRole ? (
          <div className="flex items-center justify-between w-full gap-2">
            {task.status === 'pending_approval' ? (
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => {
                    approveTaskAndAwardPoints(task.id);
                    notificationService.playSuccessChime();
                    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-3 rounded-2xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aprobar y Entregar +{task.rewardPoints} pts</span>
                </button>
                <button
                  onClick={() => {
                    rejectTaskForRevision(task.id);
                    notificationService.playAttentionChime();
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs py-2 px-3 rounded-2xl transition"
                  title="Pedir revisar nuevamente"
                >
                  <span>✍️ Pedir Revisar</span>
                </button>
              </div>
            ) : (
              <>
                <span className="text-xs text-slate-400 font-medium">
                  Estado:{' '}
                  <strong className="text-slate-700">
                    {task.status === 'pending' && '🕐 Pendiente'}
                    {task.status === 'in_progress' && '⚙️ En Progreso'}
                    {task.status === 'completed' && '✅ Completada'}
                    {task.status === 'expired' && '⚠️ Vencida'}
                  </strong>
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold hover:bg-rose-50 px-3 py-1.5 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar Tarea</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {task.status === 'pending_approval' ? (
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl w-full justify-center">
                <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <span>⏳ Enviada a Mamá • Esperando Verificación (+{task.rewardPoints} pts)</span>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl w-full justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Tarea Completada y Aprobada por Mamá! 🎉</span>
              </div>
            ) : (
              <>
                {!showTimer && (
                  <button
                    onClick={() => setShowTimer(true)}
                    className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current text-teal-600" />
                    <span>Usar Temporizador</span>
                  </button>
                )}

                <button
                  onClick={handleCompleteTask}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold shadow-md shadow-emerald-200 transition ml-auto"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Enviar a Mamá para Aprobar!</span>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
