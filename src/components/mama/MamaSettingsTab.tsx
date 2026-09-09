import React from 'react';
import type { FamilySettings } from '../../types';

interface MamaSettingsTabProps {
  settings: FamilySettings;
  onUpdateSettings: (newSettings: Partial<FamilySettings>) => void;
}

export const MamaSettingsTab: React.FC<MamaSettingsTabProps> = ({
  settings,
  onUpdateSettings
}) => {

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
    </div>
  );
};
