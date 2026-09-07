import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ShieldCheck, X, KeyRound } from 'lucide-react';

interface PinModalProps {
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ onClose }) => {
  const { verifyPin, setRole } = useAppStore();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pinInput)) {
      setRole('mama');
      onClose();
    } else {
      setError(true);
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-purple-100 text-purple-700 p-3.5 rounded-2xl mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Acceso Cuidador / Mamá</h2>
          <p className="text-xs text-slate-500 mt-1">
            Ingresa el PIN de seguridad para acceder al panel de Mamá
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => {
                setError(false);
                setPinInput(e.target.value);
              }}
              placeholder="••••"
              autoFocus
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-center tracking-[0.5em] text-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-500 text-center animate-shake">
              PIN incorrecto. Intenta de nuevo.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-purple-200 transition-all"
          >
            Entrar a Vista Mamá
          </button>
        </form>
      </div>
    </div>
  );
};
