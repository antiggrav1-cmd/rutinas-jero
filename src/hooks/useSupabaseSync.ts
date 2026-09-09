import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SupabaseDbService } from '../services/supabaseDbService';

type SyncStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useSupabaseSync() {
  const [status, setStatus] = useState<SyncStatus>('connecting');
  const isReceiving = useRef(false);

  const familyCode = useAppStore((state) => state.settings.familyCode) || 'FAM-JERO2026';

  const getStateSnapshot = useCallback(() => {
    const state = useAppStore.getState();
    return {
      tasks: state.tasks,
      rewards: state.rewards,
      pointsBalance: state.pointsBalance,
      settings: state.settings,
    };
  }, []);

  const applyRemoteState = useCallback((payload: any) => {
    if (!payload) return;
    isReceiving.current = true;
    const store = useAppStore.getState();

    const current = getStateSnapshot();
    if (JSON.stringify(payload) !== JSON.stringify(current)) {
      if (payload.tasks !== undefined) store.setTasks(payload.tasks);
      if (payload.rewards !== undefined) store.setRewards(payload.rewards);
      if (payload.pointsBalance !== undefined) store.setPointsBalance(payload.pointsBalance);
      if (payload.settings !== undefined) store.updateSettings(payload.settings);
    }

    setTimeout(() => { isReceiving.current = false; }, 100);
  }, [getStateSnapshot]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('disconnected');
      return;
    }

    const channel = supabase.channel(`family-${familyCode}`, {
      config: { broadcast: { self: false } }
    });

    // Fetch initial persistent data from Supabase Postgres
    SupabaseDbService.fetchFamilyData(familyCode).then((data) => {
      if (!data) return;
      const store = useAppStore.getState();

      if (Array.isArray(data.tasks)) {
        const mappedTasks = data.tasks.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          category: t.category,
          estimatedMinutes: t.estimated_minutes,
          rewardPoints: t.reward_points,
          substeps: t.substeps || [],
          status: t.status,
          assignedDate: t.assigned_date,
          dueTime: t.due_time || undefined,
          frequencyType: t.frequency_type || 'sporadic',
          weeklyDays: t.weekly_days || [],
          sporadicDate: t.sporadic_date || undefined,
          expiredDate: t.expired_date || undefined,
          completedAt: t.completed_at || undefined,
        }));
        store.setTasks(mappedTasks);
      }

      if (Array.isArray(data.rewards)) {
        const mappedRewards = data.rewards.map((r: any) => ({
          id: r.id,
          title: r.title,
          costPoints: r.cost_points,
          icon: r.icon,
          redeemedCount: r.redeemed_count || 0,
        }));
        store.setRewards(mappedRewards);
      }

      if (data.profile) {
        if (data.profile.points_balance !== undefined && data.profile.points_balance !== null) {
          store.setPointsBalance(data.profile.points_balance);
        }
        store.updateSettings({
          childName: data.profile.child_name || store.settings.childName,
          streakCount: data.profile.streak_count ?? store.settings.streakCount,
          lastRolloverDate: data.profile.last_rollover_date || store.settings.lastRolloverDate,
          todayMood: data.profile.today_mood || store.settings.todayMood,
          latestNote: data.profile.latest_note ?? store.settings.latestNote,
        });
      }
    });

    channel
      .on('broadcast', { event: 'state_update' }, ({ payload }) => {
        applyRemoteState(payload);
      })
      .subscribe((subscribeStatus) => {
        if (subscribeStatus === 'SUBSCRIBED') {
          setStatus('connected');
        } else if (subscribeStatus === 'CLOSED' || subscribeStatus === 'CHANNEL_ERROR') {
          setStatus('disconnected');
        }
      });

    const unsubscribeStore = useAppStore.subscribe(() => {
      if (!isReceiving.current) {
        const snapshot = getStateSnapshot();
        // 1. Instant Realtime broadcast
        channel.send({
          type: 'broadcast',
          event: 'state_update',
          payload: snapshot
        });

        // 2. Persistent Postgres DB save in background
        SupabaseDbService.saveFamilyProfile(snapshot.settings, snapshot.pointsBalance);
        SupabaseDbService.syncTasks(familyCode, snapshot.tasks);
        SupabaseDbService.syncRewards(familyCode, snapshot.rewards);
      }
    });

    return () => {
      unsubscribeStore();
      supabase.removeChannel(channel);
    };
  }, [familyCode, applyRemoteState, getStateSnapshot]);

  return { status };
}

