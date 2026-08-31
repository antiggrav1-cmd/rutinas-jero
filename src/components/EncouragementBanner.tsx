import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Heart, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EncouragementBanner: React.FC = () => {
  const { settings, dismissNote } = useAppStore();
  const note = settings.latestNote;

  useEffect(() => {
    if (note) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.2 }
      });
    }
  }, [note]);

  if (!note) return null;

  return (
    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white rounded-3xl p-4 shadow-xl mb-6 border border-pink-300 relative animate-bounce-short">
      <button
        onClick={dismissNote}
        className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition"
        title="Cerrar nota"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="bg-white/20 p-2.5 rounded-2xl shrink-0">
          <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-pink-100 text-xs font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nota de {note.senderName}</span>
          </div>
          <p className="text-base font-black leading-snug">
            &quot;{note.message}&quot;
          </p>
          <button
            onClick={dismissNote}
            className="mt-2.5 bg-white text-pink-700 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md hover:bg-pink-50 active:scale-95 transition"
          >
            ¡Gracias Mamá! ❤️
          </button>
        </div>
      </div>
    </div>
  );
};
