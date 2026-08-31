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

export const HijoView: React.FC = () => {
  const { tasks, pointsBalance, settings } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'rewards'>('pending');

  const filteredTasks = tasks.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status !== 'completed');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const totalPendingCount = tasks.filter((t) => t.status !== 'completed').length;
  const totalCompletedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Banner de Mensaje de Ánimo de Mamá */}
      <EncouragementBanner />
      
      {/* Banner de Bienvenida */}
      <HijoHeaderBanner
        childName={settings.childName}
        streakCount={settings.streakCount || 0}
        pointsBalance={pointsBalance}
      />

      {/* Check-in Emocional Diario */}
      <MoodCheckInWidget />

      {/* Pestañas Principales Organizadas para Jero */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'pending'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>📌 Pendientes ({totalPendingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>🎉 Hechas ({totalCompletedCount})</span>
        </button>
        
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'rewards'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>🎁 Tienda de Premios</span>
        </button>
      </div>

      {/* Vista de Tareas Pendientes */}
      {activeTab === 'pending' && (
        <>
          {/* Filtros Visuales por Categoría */}
          <HijoCategoryFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Lista de Tareas Pendientes */}
          <div className="space-y-4 mb-8">
            {pendingTasks.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center my-4">
                <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-bounce" />
                <h4 className="text-lg font-bold text-emerald-900">¡Fantástico trabajo, {settings.childName}! 🎉</h4>
                <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto">
                  Has completado todas tus rutinas pendientes. Revisa la pestaña de &quot;Hechas&quot; o entra a la tienda para canjear tus estrellas.
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
        </>
      )}

      {/* Vista de Tareas Hechas */}
      {activeTab === 'completed' && (
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              Rutinas y Tareas Completadas ({completedTasks.length})
            </h3>
          </div>

          {completedTasks.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center my-4">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-700">Aún no hay tareas completadas hoy</h4>
              <p className="text-xs text-slate-400 mt-1">
                A medida que completes y mamá apruebe tus tareas, aparecerán registradas aquí.
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

      {/* Vista de Tienda de Premios */}
      {activeTab === 'rewards' && (
        <RewardStore isMamaRole={false} />
      )}
    </div>
  );
};
