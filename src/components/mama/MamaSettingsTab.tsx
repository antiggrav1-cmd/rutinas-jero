import React, { useState } from 'react';
import type { FamilySettings } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MamaSettingsTabProps {
  settings: FamilySettings;
  onUpdateSettings: (newSettings: Partial<FamilySettings>) => void;
}

export const MamaSettingsTab: React.FC<MamaSettingsTabProps> = ({
  settings,
  onUpdateSettings
}) => {
  const clearAllData = useAppStore((state) => state.clearAllData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    clearAllData();
    setShowConfirm(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 4000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
      <h3 className="text-lg font-bold text-slate-800 border-b pb-3">Ajustes de Seguridad y Familia</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Hijo/Adolescente</label>
          <input
            type="text"
            value={settings.childName}
            onChange={(e) => onUpdateSettings({ childName: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Código de Sincronización Familiar</label>
          <input
            type="text"
            value={settings.familyCode}
            onChange={(e) => onUpdateSettings({ familyCode: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">PIN de Acceso Mamá (4 dígitos)</label>
          <input
            type="password"
            maxLength={4}
            value={settings.pinMama}
            onChange={(e) => onUpdateSettings({ pinMama: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border rounded-2xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Zona de Limpieza y Reinicio de Datos */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reinicio de Datos</h4>
        <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Limpiar todas las tareas y empezar de cero</span>
            </div>
            <p className="text-[11px] text-rose-700 mt-0.5">
              Elimina todas las tareas pendientes, completadas y reinicia las estrellas a 0.
            </p>
          </div>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-sm transition shrink-0"
            >
              Limpiar Datos
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleClear}
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Sí, confirmar y borrar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {clearedNotice && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>¡Datos restablecidos con éxito! La app ha quedado en blanco lista para tus nuevas tareas.</span>
          </div>
        )}
      </div>
    </div>
  );
};
