import { supabase } from '../lib/supabase';
import type { Task, Reward, FamilySettings } from '../types';

/**
 * Service to sync application state with Supabase Postgres DB tables
 */
export class SupabaseDbService {
  /**
   * Save or update family settings in Postgres
   */
  static async saveFamilyProfile(settings: FamilySettings, pointsBalance: number) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('family_profiles')
        .upsert({
          family_code: settings.familyCode,
          child_name: settings.childName,
          points_balance: pointsBalance,
          streak_count: settings.streakCount,
          last_rollover_date: settings.lastRolloverDate,
          today_mood: settings.todayMood,
          latest_note: settings.latestNote,
          updated_at: new Date().toISOString()
        }, { onConflict: 'family_code' });

      if (error) console.warn('Supabase profile save error:', error.message);
      return data;
    } catch (e) {
      console.warn('Supabase profile save failed:', e);
      return null;
    }
  }

  /**
   * Sync tasks to Postgres
   */
  static async syncTasks(familyCode: string, tasks: Task[]) {
    if (!supabase) return null;
    try {
      const payload = tasks.map(t => ({
        id: t.id,
        family_code: familyCode,
        title: t.title,
        description: t.description,
        category: t.category,
        estimated_minutes: t.estimatedMinutes,
        reward_points: t.rewardPoints,
        substeps: t.substeps,
        status: t.status,
        assigned_date: t.assignedDate,
        due_time: t.dueTime,
        frequency_type: t.frequencyType,
        weekly_days: t.weeklyDays,
        sporadic_date: t.sporadicDate,
        expired_date: t.expiredDate,
        completed_at: t.completedAt,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('tasks')
        .upsert(payload, { onConflict: 'id' });

      if (error) console.warn('Supabase tasks save error:', error.message);
      return data;
    } catch (e) {
      console.warn('Supabase tasks save failed:', e);
      return null;
    }
  }

  /**
   * Sync rewards to Postgres
   */
  static async syncRewards(familyCode: string, rewards: Reward[]) {
    if (!supabase) return null;
    try {
      const payload = rewards.map(r => ({
        id: r.id,
        family_code: familyCode,
        title: r.title,
        cost_points: r.costPoints,
        icon: r.icon,
        redeemed_count: r.redeemedCount,
        updated_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('rewards')
        .upsert(payload, { onConflict: 'id' });

      if (error) console.warn('Supabase rewards save error:', error.message);
      return data;
    } catch (e) {
      console.warn('Supabase rewards save failed:', e);
      return null;
    }
  }

  /**
   * Fetch full family state from Postgres on startup
   */
  static async fetchFamilyData(familyCode: string) {
    if (!supabase) return null;
    try {
      const [profileRes, tasksRes, rewardsRes] = await Promise.all([
        supabase.from('family_profiles').select('*').eq('family_code', familyCode).maybeSingle(),
        supabase.from('tasks').select('*').eq('family_code', familyCode),
        supabase.from('rewards').select('*').eq('family_code', familyCode),
      ]);

      return {
        profile: profileRes.data,
        tasks: tasksRes.data,
        rewards: rewardsRes.data,
      };
    } catch (e) {
      console.warn('Supabase fetchFamilyData error:', e);
      return null;
    }
  }
}
