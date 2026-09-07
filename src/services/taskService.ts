import type { Task, SubStep } from '../types';

export interface RolloverResult {
  updatedTasks: Task[];
  newStreak: number;
  pointsBonus: number;
  hasRolloverOccurred: boolean;
}

/**
 * Calculates the daily rollover:
 * - Checks uncompleted daily/weekly tasks from yesterday.
 * - Resets streak to 0 if tasks were left incomplete, or increments streak if all completed.
 * - Awards a 20 point bonus for 3+ days streak.
 * - Marks uncompleted daily tasks as expired for Mom's review.
 * - Resets completed daily tasks back to pending with uncompleted substeps for the new day.
 */
export function calculateDailyRollover(
  tasks: Task[],
  currentStreak: number,
  lastRolloverDate: string | undefined,
  todayDate: string
): RolloverResult {
  if (lastRolloverDate === todayDate) {
    return {
      updatedTasks: tasks,
      newStreak: currentStreak,
      pointsBonus: 0,
      hasRolloverOccurred: false
    };
  }

  const uncompletedYesterday = tasks.filter(
    (t) => t.status !== 'completed' && (t.frequencyType === 'daily' || t.frequencyType === 'weekly')
  );

  let newStreak = currentStreak || 0;
  let pointsBonus = 0;

  if (uncompletedYesterday.length > 0) {
    newStreak = 0;
  } else if (tasks.length > 0) {
    newStreak += 1;
    if (newStreak >= 3) {
      pointsBonus = 20; // Super bono por racha de 3+ dias
    }
  }

  const updatedTasks = tasks.map((t) => {
    if (t.status !== 'completed' && t.frequencyType === 'daily') {
      return {
        ...t,
        status: 'expired' as const,
        expiredDate: todayDate
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

  return {
    updatedTasks,
    newStreak,
    pointsBonus,
    hasRolloverOccurred: true
  };
}

/**
 * Toggles a substep within a task safely without auto-completing the task.
 */
export function toggleSubstepInTasks(
  tasks: Task[],
  taskId: string,
  subStepId: string
): Task[] {
  return tasks.map((task) => {
    if (task.id !== taskId) return task;
    if (task.status === 'pending_approval' || task.status === 'completed') return task;

    const updatedSubsteps: SubStep[] = task.substeps.map((sub) =>
      sub.id === subStepId ? { ...sub, completed: !sub.completed } : sub
    );

    return {
      ...task,
      substeps: updatedSubsteps,
      status: 'in_progress' as const
    };
  });
}
