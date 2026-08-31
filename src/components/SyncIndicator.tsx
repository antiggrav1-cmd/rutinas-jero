import React from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface SyncIndicatorProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({ status }) => {
  const config = {
    connecting: {
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
      label: 'Sincronizando...',
      className: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    connected: {
      icon: <Wifi className="w-3 h-3" />,
      label: 'En Vivo ●',
      className: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    },
    disconnected: {
      icon: <WifiOff className="w-3 h-3" />,
      label: 'Sin conexión',
      className: 'bg-slate-50 border-slate-200 text-slate-500'
    },
    error: {
      icon: <WifiOff className="w-3 h-3" />,
      label: 'Modo local',
      className: 'bg-slate-50 border-slate-200 text-slate-400'
    }
  };

  const { icon, label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${className}`}
      title={status === 'connected' ? 'Sincronizado en tiempo real con todos los dispositivos' : 'Sincronización no disponible — cambios solo locales'}
    >
      {icon}
      {label}
    </span>
  );
};
