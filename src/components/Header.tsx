import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Star, ShieldCheck, User, Sparkles, Lock } from 'lucide-react';
import { PinModal } from './PinModal';

export const Header: React.FC = () => {
  const { currentRole, setRole, pointsBalance, settings } = useAppStore();
  const [showPinModal, setShowPinModal] = useState(false);

  const handleRoleToggle = () => {
    if (currentRole === 'hijo') {
      setShowPinModal(true);
    } else {
      setRole('hijo');
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-teal-100 shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-teal-500 to-emerald-400 text-white p-2.5 rounded-2xl shadow-sm">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800 leading-tight">
                Rutinas {settings.childName}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{settings.familyCode}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 text-amber-800 px-3.5 py-1.5 rounded-full font-bold text-sm shadow-inner">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{pointsBalance} pts</span>
            </div>

            <button
              onClick={handleRoleToggle}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                currentRole === 'mama'
                  ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-200'
                  : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
              }`}
            >
              {currentRole === 'mama' ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-200" />
                  <span>Modo Mamá</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-teal-600" />
                  <span>Modo {settings.childName}</span>
                  <Lock className="w-3 h-3 opacity-50 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {showPinModal && (
        <PinModal onClose={() => setShowPinModal(false)} />
      )}
    </>
  );
};
