/**
 * useSync.ts
 * Hook híbrido de sincronización:
 * - Si VITE_SUPABASE_URL está configurada -> Usa Supabase Realtime (Sincronización Cloud Online).
 * - Si no está configurada -> Usa WebSocket Local por Wi-Fi.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useSupabaseSync } from './useSupabaseSync';

function getSyncServerUrl(): string {
  const host = window.location.hostname;
  return `ws://${host}:4242`;
}

type SyncStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export function useSync() {
  const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL);
  const supabaseSync = useSupabaseSync();

  const ws = useRef<WebSocket | null>(null);
  const [localStatus, setLocalStatus] = useState<SyncStatus>('connecting');
  const isReceiving = useRef(false);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const connect = useCallback(() => {
    if (isSupabaseConfigured) return;

    const url = getSyncServerUrl();

    try {
      ws.current = new WebSocket(url);
    } catch {
      setLocalStatus('error');
      return;
    }

    ws.current.onopen = () => {
      setLocalStatus('connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'FULL_STATE' && message.payload) {
          applyRemoteState(message.payload);
        }
      } catch (e) {
        console.error('Error procesando mensaje sync:', e);
      }
    };

    ws.current.onclose = () => {
      setLocalStatus('disconnected');
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = () => {
      setLocalStatus('error');
      ws.current?.close();
    };
  }, [isSupabaseConfigured, applyRemoteState]);

  const pushState = useCallback(() => {
    if (isReceiving.current) return;
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const snapshot = getStateSnapshot();
    ws.current.send(JSON.stringify({ type: 'STATE_UPDATE', payload: snapshot }));
  }, [getStateSnapshot]);

  useEffect(() => {
    if (isSupabaseConfigured) return;

    connect();

    const unsubscribe = useAppStore.subscribe(() => {
      if (!isReceiving.current) {
        pushState();
      }
    });

    return () => {
      unsubscribe();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [isSupabaseConfigured, connect, pushState]);

  if (isSupabaseConfigured) {
    return supabaseSync;
  }

  return { status: localStatus };
}
