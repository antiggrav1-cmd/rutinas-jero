import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Reward, FamilySettings, Role, MoodType } from '../types';

interface AppState {
  currentRole: Role;
  pointsBalance: number;
  tasks: Task[];
  rewards: Reward[];
  settings: FamilySettings;
  activeTaskId: string | null;
  
  // Actions Role
  setRole: (role: Role) => void;
  verifyPin: (pin: string) => boolean;

  // Actions Tasks
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubStep: (taskId: string, subStepId: string) => void;
  completeTask: (taskId: string) => void;
  submitTaskForApproval: (taskId: string) => void;
  approveTaskAndAwardPoints: (taskId: string) => void;
  rejectTaskForRevision: (taskId: string) => void;
  setActiveTaskId: (id: string | null) => void;

  // Actions Rewards
  addReward: (reward: Omit<Reward, 'id' | 'redeemedCount'>) => void;
  redeemReward: (rewardId: string) => boolean;
  deleteReward: (rewardId: string) => void;
  requestRewardRedemption: (rewardId: string) => boolean;
  approveRewardRedemption: (requestId: string) => void;
  rejectRewardRedemption: (requestId: string) => void;

  // Bonus, Encouragement & Consequence
  addBonusPoints: (amount: number, reason?: string) => void;
  sendEncouragementNote: (message: string) => void;
  dismissNote: () => void;
  applyPenaltyForExpiredTask: (taskId: string, pointsToDeduct: number) => void;
  forgiveExpiredTask: (taskId: string) => void;
  checkDailyRollover: () => void;

  // Settings
  updateSettings: (newSettings: Partial<FamilySettings>) => void;
  setTodayMood: (mood: MoodType) => void;

  // Sync bulk setters (used by WebSocket sync hook)
  setTasks: (tasks: Task[]) => void;
  setRewards: (rewards: Reward[]) => void;
  setPointsBalance: (points: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: 'hijo',
      pointsBalance: 0,
      tasks: [],
      rewards: [],
      settings: {
        familyCode: 'FAM-JERO2026',
        childName: 'Jero',
        pinMama: '1234',
        theme: 'calm',
        soundEnabled: true,
        streakCount: 0
      },
      activeTaskId: null,

      setRole: (role) => set({ currentRole: role }),

      verifyPin: (pin) => get().settings.pinMama === pin,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `t-${Date.now()}`,
          status: 'pending'
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updated) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updated } : t))
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          activeTaskId: state.activeTaskId === id ? null : state.activeTaskId
        }));
      },

      toggleSubStep: (taskId, subStepId) => {
        set((state) => {
          const updatedTasks: Task[] = state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const updatedSubsteps = task.substeps.map((sub) =>
              sub.id === subStepId ? { ...sub, completed: !sub.completed } : sub
            );
            
            const allCompleted = updatedSubsteps.length > 0 && updatedSubsteps.every((s) => s.completed);
            const status: 'completed' | 'in_progress' = allCompleted ? 'completed' : 'in_progress';
            
            return {
              ...task,
              substeps: updatedSubsteps,
              status
            };
          });
          return { tasks: updatedTasks };
        });
      },

      completeTask: (taskId) => {
        get().submitTaskForApproval(taskId);
      },

      submitTaskForApproval: (taskId) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task || task.status === 'completed' || task.status === 'pending_approval') return;

        const updatedSubsteps = task.substeps.map((s) => ({ ...s, completed: true }));

        set({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: 'pending_approval', substeps: updatedSubsteps }
              : t
          ),
          activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId
        });
      },

      approveTaskAndAwardPoints: (taskId) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === taskId);
        if (!task || task.status === 'completed') return;

        const pointsToAdd = task.rewardPoints;

        set({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: 'completed', completedAt: new Date().toISOString() }
              : t
          ),
          pointsBalance: state.pointsBalance + pointsToAdd
        });
      },

      rejectTaskForRevision: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: 'in_progress' }
              : t
          )
        }));
      },

      setActiveTaskId: (id) => set({ activeTaskId: id }),

      addReward: (rewardData) => {
        const newReward: Reward = {
          ...rewardData,
          id: `r-${Date.now()}`,
          redeemedCount: 0
        };
        set((state) => ({ rewards: [...state.rewards, newReward] }));
      },

      redeemReward: (rewardId) => {
        return get().requestRewardRedemption(rewardId);
      },

      requestRewardRedemption: (rewardId) => {
        const state = get();
        const reward = state.rewards.find((r) => r.id === rewardId);
        if (!reward) return false;

        if (state.pointsBalance >= reward.costPoints) {
          const newRequest = {
            id: `req-${Date.now()}`,
            rewardId: reward.id,
            rewardTitle: reward.title,
            costPoints: reward.costPoints,
            icon: reward.icon,
            requestedAt: new Date().toISOString(),
            status: 'pending' as const
          };

          const existingRequests = state.settings.pendingRewardRequests || [];

          set({
            pointsBalance: state.pointsBalance - reward.costPoints,
            settings: {
              ...state.settings,
              pendingRewardRequests: [...existingRequests, newRequest]
            }
          });
          return true;
        }
        return false;
      },

      approveRewardRedemption: (requestId) => {
        const state = get();
        const existingRequests = state.settings.pendingRewardRequests || [];
        const req = existingRequests.find((r) => r.id === requestId);
        if (!req) return;

        set({
          rewards: state.rewards.map((r) =>
            r.id === req.rewardId ? { ...r, redeemedCount: r.redeemedCount + 1 } : r
          ),
          settings: {
            ...state.settings,
            pendingRewardRequests: existingRequests.filter((r) => r.id !== requestId)
          }
        });
      },

      rejectRewardRedemption: (requestId) => {
        const state = get();
        const existingRequests = state.settings.pendingRewardRequests || [];
        const req = existingRequests.find((r) => r.id === requestId);
        if (!req) return;

        // Devuelve los puntos descontados
        set({
          pointsBalance: state.pointsBalance + req.costPoints,
          settings: {
            ...state.settings,
            pendingRewardRequests: existingRequests.filter((r) => r.id !== requestId)
          }
        });
      },

      deleteReward: (rewardId) => {
        set((state) => ({
          rewards: state.rewards.filter((r) => r.id !== rewardId)
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      addBonusPoints: (amount) => {
        set((state) => ({
          pointsBalance: state.pointsBalance + amount
        }));
      },

      sendEncouragementNote: (message) => {
        set((state) => ({
          settings: {
            ...state.settings,
            latestNote: {
              id: `note-${Date.now()}`,
              message,
              senderName: 'Mamá',
              createdAt: new Date().toISOString()
            }
          }
        }));
      },

      dismissNote: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            latestNote: undefined
          }
        }));
      },

      applyPenaltyForExpiredTask: (taskId, pointsToDeduct) => {
        set((state) => ({
          pointsBalance: Math.max(0, state.pointsBalance - pointsToDeduct),
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'pending', substeps: t.substeps.map(s => ({ ...s, completed: false })) } : t
          )
        }));
      },

      forgiveExpiredTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, status: 'pending', substeps: t.substeps.map(s => ({ ...s, completed: false })) } : t
          )
        }));
      },

      checkDailyRollover: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.settings.lastRolloverDate === today) {
          return; // Ya se ejecutó hoy
        }

        const uncompletedYesterday = state.tasks.filter(
          (t) => t.status !== 'completed' && (t.frequencyType === 'daily' || t.frequencyType === 'weekly')
        );

        let newStreak = state.settings.streakCount || 0;
        let pointsBonus = 0;

        if (uncompletedYesterday.length > 0) {
          // Si quedaron tareas diarias/semanales sin hacer ayer -> Reinicio de racha
          newStreak = 0;
        } else if (state.tasks.length > 0) {
          // Si completó todas las tareas requeridas -> Incremento de racha
          newStreak += 1;
          if (newStreak >= 3) {
            pointsBonus = 20; // Super bono por racha de 3+ días
          }
        }

        // Marcar las no completadas como expired para revisión de Mamá y resetear rutinas para hoy
        const updatedTasks = state.tasks.map((t) => {
          if (t.status !== 'completed' && t.frequencyType === 'daily') {
            return {
              ...t,
              status: 'expired' as const,
              expiredDate: today
            };
          }
          if (t.status === 'completed' && t.frequencyType === 'daily') {
            return {
              ...t,
              status: 'pending' as const,
              substeps: t.substeps.map((s) => ({ ...s, completed: false }))
            };
          }
          return t;
        });

        set({
          tasks: updatedTasks,
          pointsBalance: state.pointsBalance + pointsBonus,
          settings: {
            ...state.settings,
            streakCount: newStreak,
            lastRolloverDate: today
          }
        });
      },

      setTodayMood: (mood) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          settings: {
            ...state.settings,
            todayMood: {
              mood,
              date: today,
              updatedAt: new Date().toISOString()
            }
          }
        }));
      },

      // Bulk sync setters (used by WebSocket sync hook)
      setTasks: (tasks) => set({ tasks }),
      setRewards: (rewards) => set({ rewards }),
      setPointsBalance: (pointsBalance) => set({ pointsBalance })
    }),
    {
      name: 'jero-asperger-adhd-app-storage'
    }
  )
);
