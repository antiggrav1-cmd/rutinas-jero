import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { CategoryType, FrequencyType, SubStep, Task } from '../types';
import { TaskCard } from './TaskCard';
import { RewardStore } from './RewardStore';
import { 
  Plus, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  Trash2, 
  ListChecks, 
  Repeat, 
  Calendar, 
  Wand2, 
  Sun, 
  Moon, 
  BookOpen, 
  Home, 
  User,
  Heart,
  Award,
  Send,
  Edit3,
  Clock,
  TrendingUp,
  MessageSquare,
  CheckCheck,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PresetTemplate {
  name: string;
  title: string;
  category: CategoryType;
  frequencyType: FrequencyType;
  estimatedMinutes: number;
  rewardPoints: number;
  substeps: string[];
  icon: any;
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    name: 'Rutina Mañana',
    title: 'Rutina de la Mañana 🌅',
    category: 'routine_morning',
    frequencyType: 'daily',
    estimatedMinutes: 20,
    rewardPoints: 30,
    substeps: [
      'Lavarse la cara y cepillarse los dientes',
      'Ponerse la ropa limpia elegida',
      'Tomar el desayuno despacio',
      'Revisar la maleta antes de salir'
    ],
    icon: Sun
  },
  {
    name: 'Rutina Noche',
    title: 'Rutina de la Noche 🌙',
    category: 'routine_night',
    frequencyType: 'daily',
    estimatedMinutes: 15,
    rewardPoints: 30,
    substeps: [
      'Apagar o guardar dispositivos electrónics',
      'Ponerse el pijama',
      'Lavar los dientes',
      'Alistar la ropa y maleta para mañana'
    ],
    icon: Moon
  },
  {
    name: 'Tarea de Colegio',
    title: 'Bloque de Enfoque: Tarea de Estudio 📚',
    category: 'school',
    frequencyType: 'weekly',
    estimatedMinutes: 25,
    rewardPoints: 50,
    substeps: [
      'Preparar la mesa libre de distracciones',
      'Leer la guía de ejercicios una vez',
      'Resolver los problemas paso a paso',
      'Guardar cuadernos y cartuchera en la maleta'
    ],
    icon: BookOpen
  },
  {
    name: 'Organizar Cuarto',
    title: 'Ordenar el Espacio Propio 🧺',
    category: 'home',
    frequencyType: 'weekly',
    estimatedMinutes: 15,
    rewardPoints: 40,
    substeps: [
      'Recoger la ropa sucia y llevarla a la cesta',
      'Hacer la cama con sábanas estiradas',
      'Alinear los libros y objetos del escritorio'
    ],
    icon: Home
  },
  {
    name: 'Cuidado Personal',
    title: 'Baño y Cuidado Personal 🧼',
    category: 'personal',
    frequencyType: 'daily',
    estimatedMinutes: 15,
    rewardPoints: 25,
    substeps: [
      'Preparar toalla y ropa interior limpia',
      'Bañarse con agua a temperatura agradable',
      'Secarse bien y peinarse frente al espejo'
    ],
    icon: User
  }
];

const DAYS_OF_WEEK = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'Mi' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' }
];

const PRESET_NOTES = [
  '¡Orgullosa de tu gran esfuerzo hoy! 🌟',
  '¡Eres un súper campeón! 🦸‍♂️',
  '¡Me encanta ver cómo te enfocas! 🎯',
  '¡Tómate un descanso muy merecido! 🍦'
];

type MamaTab = 'pending_approval' | 'active_tasks' | 'expired' | 'completed' | 'rewards' | 'settings';

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
  
  const [activeTab, setActiveTab] = useState<MamaTab>('active_tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | FrequencyType>('all');
  
  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState('');

  // Campos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('routine_morning');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [sporadicDate, setSporadicDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [rewardPoints, setRewardPoints] = useState(30);
  const [substeps, setSubsteps] = useState<{ id: string; title: string }[]>([
    { id: '1', title: 'Paso 1' }
  ]);

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
    if (!msg.trim()) return;
    sendEncouragementNote(msg.trim());
    showToast(`💬 Mensaje enviado a ${settings.childName}: "${msg.trim()}"`);
    setCustomNote('');
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setCategory(task.category);
    setFrequencyType(task.frequencyType || 'daily');
    setWeeklyDays(task.weeklyDays || [1, 2, 3, 4, 5]);
    setSporadicDate(task.sporadicDate || new Date().toISOString().split('T')[0]);
    setEstimatedMinutes(task.estimatedMinutes);
    setRewardPoints(task.rewardPoints);
    setSubsteps(
      task.substeps.map((s) => ({
        id: s.id,
        title: s.title
      }))
    );
    setShowTaskForm(true);
  };

  const handleToggleDay = (dayId: number) => {
    if (weeklyDays.includes(dayId)) {
      if (weeklyDays.length > 1) {
        setWeeklyDays(weeklyDays.filter((d) => d !== dayId));
      }
    } else {
      setWeeklyDays([...weeklyDays, dayId].sort());
    }
  };

  const handleApplyTemplate = (template: PresetTemplate) => {
    setTitle(template.title);
    setCategory(template.category);
    setFrequencyType(template.frequencyType);
    setEstimatedMinutes(template.estimatedMinutes);
    setRewardPoints(template.rewardPoints);
    setSubsteps(
      template.substeps.map((text, idx) => ({
        id: String(idx + 1),
        title: text
      }))
    );
  };

  const handleAddSubstepInput = () => {
    setSubsteps([...substeps, { id: String(Date.now()), title: '' }]);
  };

  const handleSubstepChange = (id: string, text: string) => {
    setSubsteps(substeps.map((s) => (s.id === id ? { ...s, title: text } : s)));
  };

  const handleRemoveSubstepInput = (id: string) => {
    if (substeps.length > 1) {
      setSubsteps(substeps.filter((s) => s.id !== id));
    }
  };

  const handleCreateOrUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedSubsteps: SubStep[] = substeps
      .filter((s) => s.title.trim() !== '')
      .map((s, index) => ({
        id: s.id.startsWith('sub-') ? s.id : `sub-${Date.now()}-${index}`,
        title: s.title.trim(),
        completed: false
      }));

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title,
        description,
        category,
        frequencyType,
        weeklyDays: frequencyType === 'weekly' ? weeklyDays : undefined,
        sporadicDate: frequencyType === 'sporadic' ? sporadicDate : undefined,
        estimatedMinutes: Number(estimatedMinutes),
        rewardPoints: Number(rewardPoints),
        substeps: formattedSubsteps
      });
      showToast('✏️ Tarea actualizada con éxito');
    } else {
      addTask({
        title,
        description,
        category,
        frequencyType,
        weeklyDays: frequencyType === 'weekly' ? weeklyDays : undefined,
        sporadicDate: frequencyType === 'sporadic' ? sporadicDate : undefined,
        estimatedMinutes: Number(estimatedMinutes),
        rewardPoints: Number(rewardPoints),
        substeps: formattedSubsteps,
        assignedDate: new Date().toISOString().split('T')[0]
      });
      showToast('✅ Nueva tarea creada y asignada');
    }

    // Resetear formulario
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setCategory('routine_morning');
    setFrequencyType('daily');
    setWeeklyDays([1, 2, 3, 4, 5]);
    setSporadicDate(new Date().toISOString().split('T')[0]);
    setEstimatedMinutes(15);
    setRewardPoints(30);
    setSubsteps([{ id: '1', title: 'Paso 1' }]);
    setShowTaskForm(false);
  };

  // Listas agrupadas por estado para las pestañas
  const pendingApprovalTasks = tasks.filter((t) => t.status === 'pending_approval');
  const expiredTasks = tasks.filter((t) => t.status === 'expired');
  const activeTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const filteredActiveTasks = activeTasks.filter((t) => {
    if (frequencyFilter === 'all') return true;
    return t.frequencyType === frequencyFilter;
  });

  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;
  const totalFocusMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);

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
            Supervisa avances, crea rutinas desglosadas, otorga puntos sorpresa y envía mensajes de ánimo para {settings.childName}.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTaskId(null);
            setTitle('');
            setDescription('');
            setSubsteps([{ id: '1', title: 'Paso 1' }]);
            setShowTaskForm(!showTaskForm);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold text-sm px-5 py-3 rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Crear Nueva Tarea</span>
        </button>
      </div>

      {/* 📊 TARJETA DE MÉTRICAS Y PROGRESO DIARIO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        
        {/* % Cumplimiento */}
        <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm flex items-center gap-3">
          <div className="bg-purple-100 text-purple-700 p-3 rounded-2xl shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cumplimiento Hoy</div>
            <div className="text-xl font-black text-slate-800">{completionPercentage}% ({completedTasks.length}/{totalTasksCount})</div>
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
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Puntos de {settings.childName}</div>
              <div className="text-xl font-black text-amber-900">{pointsBalance} pts</div>
            </div>
          </div>
        </div>

      </div>

      {/* 🎁 PUNTOS DE BONIFICACIÓN RÁPIDOS & MENSAJES DE ÁNIMO */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50/50 to-amber-50/40 rounded-3xl p-5 border border-purple-100/80 mb-6 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
          <div>
            <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Regalar Puntos Sorpresa & Mensajes de Ánimo</span>
            </h3>
            <p className="text-xs text-slate-500">Premia el buen esfuerzo de {settings.childName} en tiempo real</p>
          </div>

          {/* Botones de Bonificación */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-900">Bonificación:</span>
            <button
              onClick={() => handleGiveBonus(10)}
              className="bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm transition active:scale-95"
            >
              +10 pts 🌟
            </button>
            <button
              onClick={() => handleGiveBonus(20)}
              className="bg-amber-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm hover:bg-amber-600 transition active:scale-95"
            >
              +20 pts 🎉
            </button>
            <button
              onClick={() => handleGiveBonus(50)}
              className="bg-purple-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm hover:bg-purple-700 transition active:scale-95"
            >
              +50 pts 🏆
            </button>
          </div>
        </div>

        {/* Envío de Mensaje de Ánimo Sincronizado */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
            <MessageSquare className="w-4 h-4 text-pink-600" />
            <span>Enviar mensaje de ánimo inmediato a la pantalla de {settings.childName}:</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {PRESET_NOTES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSendNote(preset)}
                className="bg-white hover:bg-pink-100/70 border border-pink-200 text-pink-950 font-semibold text-xs px-3 py-1 rounded-xl transition shadow-xs"
              >
                {preset}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendNote(customNote);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder={`Escribe una nota personalizada para ${settings.childName}...`}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Nota</span>
            </button>
          </form>
        </div>
      </div>

      {/* Indicador de Estado de Ánimo de Jero (Sincronizado) */}
      {(() => {
        const today = new Date().toISOString().split('T')[0];
        const moodData = settings.todayMood?.date === today ? settings.todayMood : null;

        if (!moodData) {
          return (
            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 mb-6 flex items-center justify-between text-xs text-purple-900 font-medium">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-purple-500 fill-current" />
                <span>{settings.childName} aún no ha registrado su estado de ánimo hoy.</span>
              </div>
              <span className="text-[11px] text-purple-500 italic">Esperando check-in...</span>
            </div>
          );
        }

        const moodMap: Record<string, { emoji: string; label: string; tip: string; bg: string; border: string; text: string }> = {
          happy: {
            emoji: '😊',
            label: 'Feliz y Motivado',
            tip: '¡Excelente día! Es un gran momento para realizar bloques de estudio o rutinas nuevas.',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-900'
          },
          calm: {
            emoji: '😌',
            label: 'Tranquilo / Enfocado',
            tip: 'Buen nivel de calma sensorial. Ideal para mantener el ritmo habitual de tareas desglosadas.',
            bg: 'bg-teal-50',
            border: 'border-teal-200',
            text: 'text-teal-900'
          },
          neutral: {
            emoji: '😐',
            label: 'Equilibrado / Normal',
            tip: 'Estado estable. Mantener las instrucciones sencillas y la predecibilidad habitual.',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            text: 'text-slate-800'
          },
          tired: {
            emoji: '😴',
            label: 'Con Sueño o Cansancio',
            tip: 'Consejo: Dar pausas de 10 min entre tareas, hidratación y flexibilidad en los tiempos.',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            text: 'text-indigo-900'
          },
          anxious: {
            emoji: '😟',
            label: 'Abrumado / Con Ruido',
            tip: 'Consejo: Reducir estímulos auditivos, acompañar con calma y dividir la tarea en pasos más pequeños.',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-900'
          }
        };

        const info = moodMap[moodData.mood] || moodMap.neutral;

        return (
          <div className={`${info.bg} border ${info.border} rounded-3xl p-4 mb-6 shadow-sm`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
                <span className="text-2xl">{info.emoji}</span>
                <span>Estado de ánimo de {settings.childName} hoy: <strong className={info.text}>{info.label}</strong></span>
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
      })()}

      {/* Pestañas de Navegación Organizadas para Mamá */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2 no-scrollbar">
        
        {/* Pestaña: Por Aprobar */}
        <button
          onClick={() => setActiveTab('pending_approval')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition relative shrink-0 ${
            activeTab === 'pending_approval'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
              : pendingApprovalTasks.length > 0
              ? 'bg-amber-50 text-amber-900 border border-amber-300 font-black animate-pulse'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>📩 Por Aprobar ({pendingApprovalTasks.length})</span>
        </button>

        {/* Pestaña: Tareas Asignadas Activas */}
        <button
          onClick={() => setActiveTab('active_tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'active_tasks'
              ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>📌 Asignadas ({activeTasks.length})</span>
        </button>

        {/* Pestaña: Tareas Vencidas */}
        <button
          onClick={() => setActiveTab('expired')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'expired'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
              : expiredTasks.length > 0
              ? 'bg-rose-50 text-rose-900 border border-rose-200 font-extrabold'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>⚠️ Vencidas ({expiredTasks.length})</span>
        </button>

        {/* Pestaña: Completadas */}
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>🎉 Completadas ({completedTasks.length})</span>
        </button>

        {/* Pestaña: Recompensas */}
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'rewards'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>🎁 Recompensas</span>
        </button>

        {/* Pestaña: Configuración */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs transition shrink-0 ${
            activeTab === 'settings'
              ? 'bg-slate-800 text-white shadow-md shadow-slate-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>⚙️ Configuración</span>
        </button>
      </div>

      {/* Formulario Desplegable para Crear o Editar Tarea */}
      {showTaskForm && (
        <form onSubmit={handleCreateOrUpdateTask} className="bg-white rounded-3xl p-6 border border-purple-200 shadow-xl mb-8 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {editingTaskId ? '✏️ Editar Tarea Existente' : '✨ Nueva Tarea o Rutina Desglosada'}
              </h3>
              <p className="text-xs text-slate-500">Configura la frecuencia de repetición y los pasos detallados</p>
            </div>
            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
              Asperger & TDAH Ready
            </span>
          </div>

          {/* Plantillas Rápidas */}
          {!editingTaskId && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 mb-2">
                <Wand2 className="w-4 h-4 text-amber-600" />
                <span>Plantillas Rápidas Predefinidas (Clic para autocompletar):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  return (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="flex items-center gap-1.5 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-950 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-600" />
                      <span>{tmpl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Frecuencia de Repetición */}
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-3">
            <label className="block text-xs font-extrabold text-purple-900 uppercase tracking-wider">
              Frecuencia de Repetición
            </label>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFrequencyType('daily')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  frequencyType === 'daily'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>🔁 Diaria</span>
              </button>

              <button
                type="button"
                onClick={() => setFrequencyType('weekly')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  frequencyType === 'weekly'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>📅 Semanal</span>
              </button>

              <button
                type="button"
                onClick={() => setFrequencyType('sporadic')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                  frequencyType === 'sporadic'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>📍 Esporádica</span>
              </button>
            </div>

            {frequencyType === 'weekly' && (
              <div className="pt-2">
                <span className="block text-xs font-bold text-slate-700 mb-1.5">
                  Selecciona los días de la semana:
                </span>
                <div className="flex gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = weeklyDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleToggleDay(day.id)}
                        className={`w-9 h-9 rounded-xl font-extrabold text-xs transition border ${
                          isSelected
                            ? 'bg-purple-700 text-white border-purple-800 shadow'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-purple-100'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {frequencyType === 'sporadic' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fecha Específica para la actividad:
                </label>
                <input
                  type="date"
                  value={sporadicDate}
                  onChange={(e) => setSporadicDate(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Tarea</label>
              <input
                type="text"
                placeholder="Ej. Tarea de Ciencias Sociales"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Visual</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
              >
                <option value="routine_morning">🌅 Rutina Mañana</option>
                <option value="routine_night">🌙 Rutina Noche</option>
                <option value="school">📚 Escuela / Estudio</option>
                <option value="home">🧺 Hogar / Habitación</option>
                <option value="personal">🧼 Cuidado Personal</option>
                <option value="custom">✨ Otra Actividad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Descripción / Instrucción Corta</label>
            <input
              type="text"
              placeholder="Ej. Realizar en el escritorio libre de objetos"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiempo Estimado (Minutos)</label>
              <input
                type="number"
                min={5}
                max={120}
                step={5}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 border rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Puntos de Recompensa</label>
              <input
                type="number"
                min={10}
                max={500}
                step={5}
                value={rewardPoints}
                onChange={(e) => setRewardPoints(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-50 border rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sección de Sub-pasos */}
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900">
                Pasos Secuenciales (Desglose recomendado para evitar saturación)
              </label>
              <button
                type="button"
                onClick={handleAddSubstepInput}
                className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Añadir Paso</span>
              </button>
            </div>

            {substeps.map((sub, idx) => (
              <div key={sub.id} className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 w-5">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder={`Descripción del paso ${idx + 1}`}
                  value={sub.title}
                  onChange={(e) => handleSubstepChange(sub.id, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {substeps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubstepInput(sub.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowTaskForm(false);
                setEditingTaskId(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-2xl shadow-md transition"
            >
              {editingTaskId ? 'Guardar Cambios' : 'Guardar y Asignar Tarea'}
            </button>
          </div>
        </form>
      )}

      {/* PESTAÑA: POR APROBAR */}
      {activeTab === 'pending_approval' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
              Tareas de {settings.childName} Esperando tu Verificación ({pendingApprovalTasks.length})
            </h3>
          </div>

          {pendingApprovalTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-500">No hay tareas pendientes por aprobar en este momento.</p>
              <p className="text-xs text-slate-400 mt-1">Cuando {settings.childName} termine sus pasos, aparecerán aquí para tu revisión.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingApprovalTasks.map((task) => (
                <TaskCard key={task.id} task={task} isMamaRole={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA: TAREAS ASIGNADAS ACTIVAS */}
      {activeTab === 'active_tasks' && (
        <div className="space-y-4">
          
          {/* Filtro por Frecuencia de Tareas */}
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
                  
                  {/* Botón de Editar Tarea para Mamá */}
                  <button
                    onClick={() => handleEditTask(task)}
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

      {/* PESTAÑA: TAREAS VENCIDAS */}
      {activeTab === 'expired' && (
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
                      onClick={() => {
                        applyPenaltyForExpiredTask(task.id, 10);
                        showToast(`📉 Se aplicó la consecuencia (-10 pts) en: "${task.title}"`);
                      }}
                      className="flex-1 sm:flex-none bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition"
                    >
                      📉 Aplicar Consecuencia (-10 pts)
                    </button>
                    <button
                      onClick={() => {
                        forgiveExpiredTask(task.id);
                        showToast(`🤝 Se justificó la tarea: "${task.title}"`);
                      }}
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
      )}

      {/* PESTAÑA: COMPLETADAS */}
      {activeTab === 'completed' && (
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

      {activeTab === 'rewards' && (
        <RewardStore isMamaRole={true} />
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-3">Ajustes de Seguridad y Familia</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Hijo/Adolescente</label>
              <input
                type="text"
                value={settings.childName}
                onChange={(e) => updateSettings({ childName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Código de Sincronización Familiar</label>
              <input
                type="text"
                value={settings.familyCode}
                onChange={(e) => updateSettings({ familyCode: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">PIN de Acceso Mamá (4 dígitos)</label>
              <input
                type="password"
                maxLength={4}
                value={settings.pinMama}
                onChange={(e) => updateSettings({ pinMama: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
