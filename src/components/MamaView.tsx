import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { FrequencyType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { RewardStore } from './RewardStore';
import { MamaMetricsCard } from './mama/MamaMetricsCard';
import { MamaBonusAndNoteWidget } from './mama/MamaBonusAndNoteWidget';
import { MamaMoodIndicator } from './mama/MamaMoodIndicator';
import { MamaPendingApprovalTasks } from './mama/MamaPendingApprovalTasks';
import { MamaExpiredTasksReview } from './mama/MamaExpiredTasksReview';
import { MamaSettingsTab } from './mama/MamaSettingsTab';
import { MamaTaskForm } from './mama/MamaTaskForm';
import { 
  Plus, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  ListChecks, 
  Edit3, 
  Clock, 
  CheckCheck, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTodayISO, isTimePastToday, formatDueTime } from '../utils/dateUtils';

type MamaMainTab = 'resumen' | 'puntos_premios' | 'actividades' | 'settings';
type ActivitySubTab = 'pending_approval' | 'active_tasks' | 'expired' | 'completed';

export const MamaView: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    settings, 
    updateSettings, 
    pointsBalance, 
    addBonusPoints, 
    sendEncouragementNote,
    applyPenaltyForExpiredTask,
    forgiveExpiredTask
  } = useAppStore();
  
  const [mainTab, setMainTab] = useState<MamaMainTab>('actividades');
  const [activitySubTab, setActivitySubTab] = useState<ActivitySubTab>('active_tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | FrequencyType>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGiveBonus = (pts: number) => {
    addBonusPoints(pts);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.4 } });
    showToast(`🎁 ¡Le diste +${pts} puntos sorpresa a ${settings.childName}!`);
  };

  const handleSendNote = (msg: string) => {
    sendEncouragementNote(msg);
    showToast(`💬 Mensaje enviado a ${settings.childName}: "${msg}"`);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCreateOrUpdateTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      showToast('✏️ Tarea actualizada con éxito');
    } else {
      addTask({
        ...taskData,
        assignedDate: getTodayISO()
      });
      showToast('✅ Nueva tarea creada y asignada');
    }

    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleApplyPenalty = (taskId: string, title: string, points: number = 10) => {
    applyPenaltyForExpiredTask(taskId, points);
    sendEncouragementNote(`⚠️ Se descontaron ${points} estrellas por no completar la tarea "${title}". ¡Ánimo ${settings.childName}, en la siguiente tarea puedes recuperarte! 💪`);
    showToast(`📉 Se aplicó la penalización (-${points} pts) en: "${title}"`);
  };

  const handleApplyOverduePenalty = (taskId: string, title: string, points: number = 10) => {
    applyPenaltyForExpiredTask(taskId, points);
    updateTask(taskId, { dueTime: undefined });
    sendEncouragementNote(`⚠️ Se descontaron ${points} estrellas por superar la hora límite en "${title}". ¡Aún puedes completarla para ganar nuevos puntos! 💪`);
    showToast(`📉 Penalización aplicada (-${points} pts) en: "${title}"`);
  };

  const handleExtendDueTime = (taskId: string, title: string) => {
    updateTask(taskId, { dueTime: undefined });
    showToast(`⏳ Se retiró la hora límite de "${title}" para darle más tiempo a ${settings.childName}`);
  };

  const handleForgive = (taskId: string, title: string) => {
    forgiveExpiredTask(taskId);
    showToast(`🤝 Se justificó la tarea: "${title}"`);
  };

  // Grupos de Tareas
  const pendingApprovalTasks = tasks.filter((t) => t.status === 'pending_approval');
  const expiredTasks = tasks.filter((t) => t.status === 'expired');
  const activeTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = activeTasks.filter((t) => isTimePastToday(t.dueTime));

  const filteredActiveTasks = activeTasks.filter((t) => {
    if (frequencyFilter === 'all') return true;
    return t.frequencyType === frequencyFilter;
  });

  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;
  const totalFocusMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const pendingRewardsCount = settings.pendingRewardRequests?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 text-xs font-bold flex items-center gap-2 animate-bounce-short border border-purple-400">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner Superior Modo Cuidador */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-purple-800">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Panel de Gestión & Acompañamiento</span>
          </div>
          <h2 className="text-2xl font-black">Modo Cuidador / Mamá</h2>
          <p className="text-xs text-purple-200 mt-1 max-w-md">
            Supervisa avances, crea rutinas desglosadas, otorga puntos sorpresa y acompaña el día de {settings.childName}.
          </p>
        </div>

        <button
          onClick={() => {
            setMainTab('actividades');
            setEditingTask(null);
            setShowTaskForm(!showTaskForm);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Crear Nueva Tarea</span>
        </button>
      </div>

      {/* Alerta de Tareas que superaron la Hora Límite */}
      {overdueTasks.length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white p-4 rounded-3xl shadow-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-rose-400/80 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce-short" />
            </div>
            <div>
              <h4 className="font-black text-sm flex items-center gap-1.5">
                <span>⚠️ Alerta de Tiempo:</span>
                <span>{overdueTasks.length} {overdueTasks.length === 1 ? 'tarea superó' : 'tareas superaron'} la hora límite</span>
              </h4>
              <p className="text-xs text-rose-100 mt-0.5 font-medium">
                {overdueTasks.map(t => `${t.title} (${formatDueTime(t.dueTime)})`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMainTab('actividades');
              setActivitySubTab('active_tasks');
            }}
            className="bg-white hover:bg-rose-50 active:scale-95 text-rose-950 font-black text-xs px-4 py-2.5 rounded-2xl shrink-0 shadow-md transition"
          >
            Revisar Tareas
          </button>
        </div>
      )}

      {/* Pestañas Principales Organizadas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setMainTab('resumen')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-xs transition border shadow-sm ${
            mainTab === 'resumen'
              ? 'bg-purple-700 text-white border-purple-800 ring-2 ring-purple-400 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>📊 Resumen</span>
        </button>

        <button
          onClick={() => setMainTab('puntos_premios')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-xs transition border shadow-sm relative ${
            mainTab === 'puntos_premios'
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>🎁 Regalar Puntos</span>
          {pendingRewardsCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {pendingRewardsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setMainTab('actividades')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-xs transition border shadow-sm relative ${
            mainTab === 'actividades'
              ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ListChecks className="w-4 h-4 text-indigo-400" />
          <span>📋 Actividades</span>
          {overdueTasks.length > 0 ? (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse" title="Tareas que superaron la hora límite">
              ⚠️ {overdueTasks.length}
            </span>
          ) : pendingApprovalTasks.length > 0 ? (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
              {pendingApprovalTasks.length}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => setMainTab('settings')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-xs transition border shadow-sm ${
            mainTab === 'settings'
              ? 'bg-slate-800 text-white border-slate-900 ring-2 ring-slate-400 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>⚙️ Configuración</span>
        </button>
      </div>

      {/* ==================== SECCIÓN 1: RESUMEN ==================== */}
      {mainTab === 'resumen' && (
        <div className="space-y-6 animate-fade-in">
          {/* Métricas de Avance */}
          <MamaMetricsCard
            completionPercentage={completionPercentage}
            completedTasksCount={completedTasks.length}
            totalTasksCount={totalTasksCount}
            totalFocusMinutes={totalFocusMinutes}
            pointsBalance={pointsBalance}
            childName={settings.childName}
          />

          {/* Indicador de Estado de Ánimo */}
          <MamaMoodIndicator
            childName={settings.childName}
            todayMood={settings.todayMood}
          />
        </div>
      )}

      {/* ==================== SECCIÓN 2: REGALAR PUNTOS Y RECOMPENSAS ==================== */}
      {mainTab === 'puntos_premios' && (
        <div className="space-y-6 animate-fade-in">
          {/* Bonus de Puntos y Notas de Ánimo */}
          <MamaBonusAndNoteWidget
            childName={settings.childName}
            onGiveBonus={handleGiveBonus}
            onSendNote={handleSendNote}
          />

          {/* Tienda de Premios y Canjes */}
          <RewardStore isMamaRole={true} />
        </div>
      )}

      {/* ==================== SECCIÓN 3: ACTIVIDADES Y RUTINAS ==================== */}
      {mainTab === 'actividades' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Sub-pestañas de Actividades */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActivitySubTab('pending_approval')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
                activitySubTab === 'pending_approval'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : pendingApprovalTasks.length > 0
                  ? 'bg-amber-50 text-amber-900 border border-amber-300 font-black animate-pulse'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>📩 Por Aprobar ({pendingApprovalTasks.length})</span>
            </button>

            <button
              onClick={() => setActivitySubTab('active_tasks')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
                activitySubTab === 'active_tasks'
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>📌 Asignadas ({activeTasks.length})</span>
              {overdueTasks.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  ⚠️ {overdueTasks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActivitySubTab('expired')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
                activitySubTab === 'expired'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                  : (expiredTasks.length + overdueTasks.length) > 0
                  ? 'bg-rose-50 text-rose-900 border border-rose-300 font-extrabold animate-pulse'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>⚠️ Penalizaciones ({expiredTasks.length + overdueTasks.length})</span>
            </button>

            <button
              onClick={() => setActivitySubTab('completed')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
                activitySubTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>🎉 Completadas ({completedTasks.length})</span>
            </button>
          </div>

          {/* Formulario Desplegable para Crear o Editar Tarea */}
          {showTaskForm && (
            <MamaTaskForm
              editingTask={editingTask}
              onSubmit={handleCreateOrUpdateTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />
          )}

          {/* SUB-PESTAÑA: POR APROBAR */}
          {activitySubTab === 'pending_approval' && (
            <MamaPendingApprovalTasks
              childName={settings.childName}
              pendingApprovalTasks={pendingApprovalTasks}
            />
          )}

          {/* SUB-PESTAÑA: TAREAS ASIGNADAS ACTIVAS */}
          {activitySubTab === 'active_tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFrequencyFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      frequencyFilter === 'all'
                        ? 'bg-purple-800 text-white border-purple-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Todas ({activeTasks.length})
                  </button>
                  <button
                    onClick={() => setFrequencyFilter('daily')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      frequencyFilter === 'daily'
                        ? 'bg-purple-800 text-white border-purple-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🔁 Diarias ({activeTasks.filter(t => t.frequencyType === 'daily').length})
                  </button>
                  <button
                    onClick={() => setFrequencyFilter('weekly')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      frequencyFilter === 'weekly'
                        ? 'bg-purple-800 text-white border-purple-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📅 Semanales ({activeTasks.filter(t => t.frequencyType === 'weekly').length})
                  </button>
                  <button
                    onClick={() => setFrequencyFilter('sporadic')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      frequencyFilter === 'sporadic'
                        ? 'bg-purple-800 text-white border-purple-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📍 Esporádicas ({activeTasks.filter(t => t.frequencyType === 'sporadic').length})
                  </button>
                </div>

                <span className="text-xs text-slate-500 font-semibold shrink-0">
                  {activeTasks.length} activas hoy
                </span>
              </div>

              {filteredActiveTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-sm font-semibold text-slate-500">No hay tareas activas encontradas con este filtro.</p>
                  <p className="text-xs text-slate-400 mt-1">Haz clic en &quot;Crear Nueva Tarea&quot; para empezar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredActiveTasks.map((task) => (
                    <div key={task.id} className="relative group">
                      <TaskCard task={task} isMamaRole={true} />
                      <button
                        onClick={() => handleEditTaskClick(task)}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-purple-100 text-purple-700 border border-purple-200 p-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1 z-10"
                        title="Editar Tarea"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUB-PESTAÑA: PENALIZACIONES Y TAREAS VENCIDAS */}
          {activitySubTab === 'expired' && (
            <MamaExpiredTasksReview
              expiredTasks={expiredTasks}
              overdueTasks={overdueTasks}
              childName={settings.childName}
              onApplyPenalty={handleApplyPenalty}
              onApplyOverduePenalty={handleApplyOverduePenalty}
              onForgive={handleForgive}
              onExtendDueTime={handleExtendDueTime}
            />
          )}

          {/* SUB-PESTAÑA: COMPLETADAS */}
          {activitySubTab === 'completed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Historial de Rutinas Aprobadas Hoy ({completedTasks.length})
                </h3>
              </div>

              {completedTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                  <CheckCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-500">Aún no hay tareas aprobadas hoy.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} isMamaRole={true} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== SECCIÓN 4: CONFIGURACIÓN ==================== */}
      {mainTab === 'settings' && (
        <div className="animate-fade-in">
          <MamaSettingsTab
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        </div>
      )}
    </div>
  );
};
