import React, { useState, useEffect } from 'react';
import type { CategoryType, FrequencyType, SubStep, Task } from '../../types';
import { PRESET_TEMPLATES, DAYS_OF_WEEK, type PresetTemplate } from '../../constants';
import { Wand2, Repeat, Calendar, Sparkles, PlusCircle, Trash2 } from 'lucide-react';

interface MamaTaskFormProps {
  editingTask: Task | null;
  onSubmit: (taskData: {
    title: string;
    description: string;
    category: CategoryType;
    frequencyType: FrequencyType;
    weeklyDays?: number[];
    sporadicDate?: string;
    dueTime?: string;
    estimatedMinutes: number;
    rewardPoints: number;
    substeps: SubStep[];
  }) => void;
  onCancel: () => void;
}

export const MamaTaskForm: React.FC<MamaTaskFormProps> = ({
  editingTask,
  onSubmit,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('routine_morning');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [sporadicDate, setSporadicDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState<string>('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [rewardPoints, setRewardPoints] = useState(30);
  const [substeps, setSubsteps] = useState<{ id: string; title: string }[]>([
    { id: '1', title: 'Paso 1' }
  ]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCategory(editingTask.category);
      setFrequencyType(editingTask.frequencyType || 'daily');
      setWeeklyDays(editingTask.weeklyDays || [1, 2, 3, 4, 5]);
      setSporadicDate(editingTask.sporadicDate || new Date().toISOString().split('T')[0]);
      setDueTime(editingTask.dueTime || '');
      setEstimatedMinutes(editingTask.estimatedMinutes);
      setRewardPoints(editingTask.rewardPoints);
      setSubsteps(
        editingTask.substeps.map((s) => ({ id: s.id, title: s.title }))
      );
    }
  }, [editingTask]);

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

  const handleToggleDay = (dayId: number) => {
    if (weeklyDays.includes(dayId)) {
      if (weeklyDays.length > 1) {
        setWeeklyDays(weeklyDays.filter((d) => d !== dayId));
      }
    } else {
      setWeeklyDays([...weeklyDays, dayId].sort());
    }
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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedSubsteps: SubStep[] = substeps
      .filter((s) => s.title.trim() !== '')
      .map((s, index) => ({
        id: s.id.startsWith('sub-') ? s.id : `sub-${Date.now()}-${index}`,
        title: s.title.trim(),
        completed: false
      }));

    onSubmit({
      title,
      description,
      category,
      frequencyType,
      weeklyDays: frequencyType === 'weekly' ? weeklyDays : undefined,
      sporadicDate: frequencyType === 'sporadic' ? sporadicDate : undefined,
      dueTime: dueTime.trim() ? dueTime.trim() : undefined,
      estimatedMinutes: Number(estimatedMinutes),
      rewardPoints: Number(rewardPoints),
      substeps: formattedSubsteps
    });
  };

  return (
    <form onSubmit={handleSubmitForm} className="bg-white rounded-3xl p-6 border border-purple-200 shadow-xl mb-8 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {editingTask ? '✏️ Editar Tarea Existente' : '✨ Nueva Tarea o Rutina Desglosada'}
          </h3>
          <p className="text-xs text-slate-500">Configura la frecuencia de repetición y los pasos detallados</p>
        </div>
        <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
          Asperger & TDAH Ready
        </span>
      </div>

      {!editingTask && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 mb-2">
            <Wand2 className="w-4 h-4 text-amber-600" />
            <span>Plantillas Rápidas Predefinidas (Clic para autocompletar):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="text-left p-2.5 bg-white border border-amber-200 rounded-xl hover:bg-amber-100/60 transition text-xs flex flex-col justify-between shadow-2xs"
              >
                <div className="font-bold text-slate-800 line-clamp-1">{tpl.title}</div>
                <div className="text-[10px] text-amber-800 mt-1 flex items-center justify-between">
                  <span>{tpl.estimatedMinutes}m</span>
                  <span className="font-bold">+{tpl.rewardPoints}pts</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <label className="block text-xs font-bold text-slate-700">Frecuencia / Repetición de la Tarea</label>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setFrequencyType('daily')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition border ${
              frequencyType === 'daily'
                ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>🔁 Todos los días</span>
          </button>

          <button
            type="button"
            onClick={() => setFrequencyType('weekly')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition border ${
              frequencyType === 'weekly'
                ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 Días de la semana</span>
          </button>

          <button
            type="button"
            onClick={() => setFrequencyType('sporadic')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition border ${
              frequencyType === 'sporadic'
                ? 'bg-purple-700 text-white border-purple-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>📍 Tarea Puntual</span>
          </button>
        </div>

        {frequencyType === 'weekly' && (
          <div className="pt-2 border-t border-slate-200/60 animate-fade-in">
            <span className="text-[11px] text-slate-500 font-semibold block mb-2">Selecciona los días que se repite:</span>
            <div className="flex flex-wrap gap-1.5">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = weeklyDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleToggleDay(day.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-purple-50'
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
          <div className="pt-2 border-t border-slate-200/60 animate-fade-in">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Fecha programada para esta tarea:</span>
            <input
              type="date"
              value={sporadicDate}
              onChange={(e) => setSporadicDate(e.target.value)}
              className="px-4 py-2 bg-white border rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Tarea / Rutina</label>
          <input
            type="text"
            required
            placeholder="Ej. Lavarme los dientes después de cenar"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
          >
            <option value="routine_morning">🌅 Rutina Mañana</option>
            <option value="routine_night">🌙 Rutina Noche</option>
            <option value="school">📚 Escuela / Tareas</option>
            <option value="home">🧺 Hogar / Cuarto</option>
            <option value="personal">🧼 Cuidado Personal</option>
            <option value="custom">✨ Otra Actividad</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Instrucción Clara o Acompañamiento (Opcional)</label>
        <input
          type="text"
          placeholder="Ej. Realizar en el escritorio libre de objetos"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 bg-slate-50 border rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">⏰ Hora Límite</label>
            {dueTime && (
              <button
                type="button"
                onClick={() => setDueTime('')}
                className="text-[10px] text-rose-500 hover:underline font-semibold"
              >
                Quitar
              </button>
            )}
          </div>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">Referencia para alertas</span>
        </div>
      </div>

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
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-4 py-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-2xl shadow-md transition"
        >
          {editingTask ? 'Guardar Cambios' : 'Guardar y Asignar Tarea'}
        </button>
      </div>
    </form>
  );
};
