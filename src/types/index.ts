export type Role = 'mama' | 'hijo';

export type CategoryType = 
  | 'routine_morning'
  | 'routine_night'
  | 'school'
  | 'home'
  | 'personal'
  | 'custom';

export type FrequencyType = 'daily' | 'weekly' | 'sporadic';

export type MoodType = 'happy' | 'calm' | 'neutral' | 'tired' | 'anxious';

export interface MoodCheckIn {
  mood: MoodType;
  date: string; // YYYY-MM-DD
  updatedAt: string; // ISO string
}

export interface EncouragementNote {
  id: string;
  message: string;
  senderName: string;
  createdAt: string;
}

export interface RewardRedemptionRequest {
  id: string;
  rewardId: string;
  rewardTitle: string;
  costPoints: number;
  icon: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SubStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  estimatedMinutes: number;
  rewardPoints: number;
  substeps: SubStep[];
  status: 'pending' | 'in_progress' | 'pending_approval' | 'completed' | 'expired';
  assignedDate: string; // YYYY-MM-DD
  completedAt?: string;
  frequencyType: FrequencyType;
  weeklyDays?: number[]; // Array de días 0 (Dom) a 6 (Sáb)
  sporadicDate?: string; // YYYY-MM-DD para tareas esporádicas
  dueTime?: string; // HH:mm hora límite de referencia
  expiredDate?: string; // Fecha en la que venció
}

export interface Reward {
  id: string;
  title: string;
  costPoints: number;
  icon: string;
  redeemedCount: number;
}

export interface FamilySettings {
  familyCode: string;
  childName: string;
  pinMama: string; // PIN de 4 dígitos para cambiar a vista Mamá
  theme: 'calm' | 'light' | 'dark';
  soundEnabled: boolean;
  todayMood?: MoodCheckIn;
  latestNote?: EncouragementNote;
  streakCount: number;
  lastRolloverDate?: string;
  pendingRewardRequests?: RewardRedemptionRequest[];
}
