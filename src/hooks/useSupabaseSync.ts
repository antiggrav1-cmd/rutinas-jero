import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';

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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      setStatus('disconnected');
      return;
    }

    const channel = supabase.channel(`family-${familyCode}`, {
      config: { broadcast: { self: false } }
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
        channel.send({
          type: 'broadcast',
          event: 'state_update',
          payload: snapshot
        });
      }
    });

    return () => {
      unsubscribeStore();
      supabase.removeChannel(channel);
    };
  }, [familyCode, applyRemoteState, getStateSnapshot]);

  return { status };
}
