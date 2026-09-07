import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { CategoryType } from '../types';
import { TaskCard } from './TaskCard';
import { RewardStore } from './RewardStore';
import { MoodCheckInWidget } from './MoodCheckInWidget';
import { EncouragementBanner } from './EncouragementBanner';
import { HijoHeaderBanner } from './hijo/HijoHeaderBanner';
import { HijoCategoryFilters } from './hijo/HijoCategoryFilters';
import { 
  Sparkles, 
  CheckCircle2, 
  Gift, 
  Clock, 
  CheckCheck 
} from 'lucide-react';

type HijoMainTab = 'tareas' | 'completadas' | 'premios' | 'emociones';

export const HijoView: React.FC = () => {
  const { tasks, pointsBalance, settings } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<HijoMainTab>('tareas');

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  // Only show actionable tasks to Jero — expired go to Mom's panel
  const pendingTasks = filteredTasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress' || t.status === 'pending_approval'
  );
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const totalPendingCount = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress' || t.status === 'pending_approval'
  ).length;
  const totalCompletedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingRewardsCount = settings.pendingRewardRequests?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Banner de Mensaje de Ánimo de Mamá */}
      <EncouragementBanner />
      
      {/* Banner de Bienvenida y Racha */}
      <HijoHeaderBanner
        childName={settings.childName}
        streakCount={settings.streakCount || 0}
        pointsBalance={pointsBalance}
      />

      {/* Pestañas Principales para Jero (Grid de 4 botones grandes y accesibles) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('tareas')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-extrabold text-xs transition border shadow-sm relative ${
            activeTab === 'tareas'
              ? 'bg-teal-600 text-white border-teal-700 ring-2 ring-teal-300 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4 text-teal-400" />
          <span>📌 Mis Tareas</span>
          {totalPendingCount > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              activeTab === 'tareas' ? 'bg-white text-teal-900' : 'bg-teal-600 text-white'
            }`}>
              {totalPendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('completadas')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-extrabold text-xs transition border shadow-sm ${
            activeTab === 'completadas'
              ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>🎉 Hechas</span>
          {totalCompletedCount > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              activeTab === 'completadas' ? 'bg-white text-emerald-900' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {totalCompletedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('premios')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-extrabold text-xs transition border shadow-sm relative ${
            activeTab === 'premios'
              ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>🎁 Premios</span>
          {pendingRewardsCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
              {pendingRewardsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('emociones')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-extrabold text-xs transition border shadow-sm ${
            activeTab === 'emociones'
              ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>💖 Mi Ánimo</span>
        </button>
      </div>

      {/* ==================== SECCIÓN 1: MIS TAREAS PENDIENTES ==================== */}
      {activeTab === 'tareas' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filtros Visuales por Categoría */}
          <HijoCategoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Lista de Tareas */}
          <div className="space-y-4 mb-8">
            {pendingTasks.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center my-4">
                <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
                <h4 className="text-lg font-bold text-emerald-900">¡Fantástico trabajo, {settings.childName}! 🎉</h4>
                <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto">
                  Has completado todas tus tareas pendientes. Ve a la pestaña de &quot;Hechas&quot; o entra a la tienda de premios para canjear tus estrellas.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== SECCIÓN 2: TAREAS HECHAS ==================== */}
      {activeTab === 'completadas' && (
        <div className="space-y-4 mb-8 animate-fade-in">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              Rutinas y Tareas Completadas Hoy ({completedTasks.length})
            </h3>
          </div>

          {completedTasks.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center my-4">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-700">Aún no hay tareas completadas hoy</h4>
              <p className="text-xs text-slate-400 mt-1">
                A medida que completes y mamá apruebe tus tareas, aparecerán registradas aquí con tus estrellas ganadas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== SECCIÓN 3: TIENDA DE PREMIOS ==================== */}
      {activeTab === 'premios' && (
        <div className="animate-fade-in">
          <RewardStore isMamaRole={false} />
        </div>
      )}

      {/* ==================== SECCIÓN 4: CHECK-IN EMOCIONAL ==================== */}
      {activeTab === 'emociones' && (
        <div className="animate-fade-in space-y-4">
          <MoodCheckInWidget />
        </div>
      )}
    </div>
  );
};
