import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { CategoryType } from '../types';
import { TaskCard } from './TaskCard';
import { RewardStore } from './RewardStore';
import { MoodCheckInWidget } from './MoodCheckInWidget';
import { EncouragementBanner } from './EncouragementBanner';
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Home, 
  User, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Gift, 
  Flame, 
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
      
      {/* Banner de Bienvenida Cálido y Motivador (Bajo Ruido Sensorial) */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Modo Enfoque Tranquilo</span>
          </div>
          <h2 className="text-2xl font-black">¡Hola, {settings.childName}! 👋</h2>
          <p className="text-xs text-teal-100 mt-1 max-w-md">
            Completa cada paso a tu propio ritmo. Cada tarea terminada te da estrellas para ganar tus premios.
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
              <div className="text-lg font-black text-white">{settings.streakCount || 0} Días 🔥</div>
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

      {/* Check-in Emocional Diario */}
      <MoodCheckInWidget />

      {/* Pestañas Principales Organizadas para Jero */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2 no-scrollbar">
        
        {/* Pestaña Tareas Pendientes */}
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

        {/* Pestaña Tareas Hechas */}
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
        
        {/* Pestaña Premios */}
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
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap border transition ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas las Rutinas
            </button>
            <button
              onClick={() => setSelectedCategory('routine_morning')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
                selectedCategory === 'routine_morning'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Mañana</span>
            </button>
            <button
              onClick={() => setSelectedCategory('routine_night')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
                selectedCategory === 'routine_night'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-indigo-800 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Noche</span>
            </button>
            <button
              onClick={() => setSelectedCategory('school')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
                selectedCategory === 'school'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Escuela</span>
            </button>
            <button
              onClick={() => setSelectedCategory('home')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
                selectedCategory === 'home'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Hogar</span>
            </button>
            <button
              onClick={() => setSelectedCategory('personal')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition ${
                selectedCategory === 'personal'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Cuidado</span>
            </button>
          </div>

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

      {/* Vista de Tareas Hechas / Completadas */}
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
