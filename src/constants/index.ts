import type { CategoryType, FrequencyType, MoodType } from '../types';
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Home, 
  User, 
  Sparkles 
} from 'lucide-react';

export interface CategoryConfigItem {
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: any;
}

export const CATEGORY_CONFIG: Record<CategoryType, CategoryConfigItem> = {
  routine_morning: {
    label: 'Rutina Mañana',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: Sun
  },
  routine_night: {
    label: 'Rutina Noche',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    icon: Moon
  },
  school: {
    label: 'Escuela / Estudio',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: BookOpen
  },
  home: {
    label: 'Hogar / Habitación',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: Home
  },
  personal: {
    label: 'Cuidado Personal',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: User
  },
  custom: {
    label: 'Actividad',
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    border: 'border-slate-200',
    icon: Sparkles
  }
};

export interface PresetTemplate {
  name: string;
  title: string;
  category: CategoryType;
  frequencyType: FrequencyType;
  estimatedMinutes: number;
  rewardPoints: number;
  substeps: string[];
  icon: any;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
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

export const DAYS_OF_WEEK = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'Mi' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' }
];

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const PRESET_NOTES = [
  '¡Orgullosa de tu gran esfuerzo hoy! 🌟',
  '¡Eres un súper campeón! 🦸‍♂️',
  '¡Me encanta ver cómo te enfocas! 🎯',
  '¡Tómate un descanso muy merecido! 🍦'
];

export interface MoodMapItem {
  emoji: string;
  label: string;
  tip: string;
  bg: string;
  border: string;
  text: string;
}

export const MOOD_MAP: Record<MoodType, MoodMapItem> = {
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
