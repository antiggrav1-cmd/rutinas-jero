import { describe, it, expect } from 'vitest';
import { calculateDailyRollover, toggleSubstepInTasks } from '../taskService';
import type { Task } from '../../types';

describe('taskService - calculateDailyRollover', () => {
  it('should not perform rollover if it already ran today', () => {
    const tasks: Task[] = [];
    const result = calculateDailyRollover(tasks, 2, '2026-09-06', '2026-09-06');
    expect(result.hasRolloverOccurred).toBe(false);
    expect(result.newStreak).toBe(2);
    expect(result.pointsBonus).toBe(0);
  });

  it('should reset streak to 0 if there were incomplete daily tasks yesterday', () => {
    const tasks: Task[] = [
      {
        id: 't-1',
        title: 'Mañana',
        category: 'routine_morning',
        frequencyType: 'daily',
        estimatedMinutes: 10,
        rewardPoints: 20,
        status: 'pending',
        assignedDate: '2026-09-05',
        substeps: []
      }
    ];

    const result = calculateDailyRollover(tasks, 5, '2026-09-05', '2026-09-06');
    expect(result.hasRolloverOccurred).toBe(true);
    expect(result.newStreak).toBe(0);
    expect(result.updatedTasks[0].status).toBe('expired');
  });

  it('should increment streak and award bonus when 3+ day streak reached and all completed', () => {
    const tasks: Task[] = [
      {
        id: 't-1',
        title: 'Mañana',
        category: 'routine_morning',
        frequencyType: 'daily',
        estimatedMinutes: 10,
        rewardPoints: 20,
        status: 'completed',
        assignedDate: '2026-09-05',
        substeps: [{ id: 's-1', title: 'Paso 1', completed: true }]
      }
    ];

    const result = calculateDailyRollover(tasks, 2, '2026-09-05', '2026-09-06');
    expect(result.hasRolloverOccurred).toBe(true);
    expect(result.newStreak).toBe(3);
    expect(result.pointsBonus).toBe(20);
    // Completed daily task resets to pending for the new day
    expect(result.updatedTasks[0].status).toBe('pending');
    expect(result.updatedTasks[0].substeps[0].completed).toBe(false);
  });
});

describe('taskService - toggleSubstepInTasks', () => {
  it('should toggle substep and keep status in_progress without auto-completing', () => {
    const tasks: Task[] = [
      {
        id: 't-1',
        title: 'Tarea',
        category: 'school',
        frequencyType: 'daily',
        estimatedMinutes: 15,
        rewardPoints: 30,
        status: 'pending',
        assignedDate: '2026-09-06',
        substeps: [
          { id: 's-1', title: 'Paso 1', completed: false },
          { id: 's-2', title: 'Paso 2', completed: false }
        ]
      }
    ];

    const updated = toggleSubstepInTasks(tasks, 't-1', 's-1');
    expect(updated[0].substeps[0].completed).toBe(true);
    expect(updated[0].status).toBe('in_progress');

    // Toggle second substep too - status should still remain in_progress for Mom approval
    const updated2 = toggleSubstepInTasks(updated, 't-1', 's-2');
    expect(updated2[0].substeps[1].completed).toBe(true);
    expect(updated2[0].status).toBe('in_progress');
  });
});
