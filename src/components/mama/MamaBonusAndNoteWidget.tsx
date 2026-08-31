import React, { useState } from 'react';
import { Award, MessageSquare, Send } from 'lucide-react';
import { PRESET_NOTES } from '../../constants';

interface MamaBonusAndNoteWidgetProps {
  childName: string;
  onGiveBonus: (pts: number) => void;
  onSendNote: (msg: string) => void;
}

export const MamaBonusAndNoteWidget: React.FC<MamaBonusAndNoteWidgetProps> = ({
  childName,
  onGiveBonus,
  onSendNote
}) => {
  const [customNote, setCustomNote] = useState('');

  const handleSubmitCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNote.trim()) return;
    onSendNote(customNote.trim());
    setCustomNote('');
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 via-pink-50/50 to-amber-50/40 rounded-3xl p-5 border border-purple-100/80 mb-6 space-y-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Regalar Puntos Sorpresa & Mensajes de Ánimo</span>
          </h3>
          <p className="text-xs text-slate-500">Premia el buen esfuerzo de {childName} en tiempo real</p>
        </div>

        {/* Botones de Bonificación */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-purple-900">Bonificación:</span>
          <button
            onClick={() => onGiveBonus(10)}
            className="bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm transition active:scale-95"
          >
            +10 pts 🌟
          </button>
          <button
            onClick={() => onGiveBonus(20)}
            className="bg-amber-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm hover:bg-amber-600 transition active:scale-95"
          >
            +20 pts 🎉
          </button>
          <button
            onClick={() => onGiveBonus(50)}
            className="bg-purple-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-sm hover:bg-purple-700 transition active:scale-95"
          >
            +50 pts 🏆
          </button>
        </div>
      </div>

      {/* Envío de Mensaje de Ánimo Sincronizado */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <MessageSquare className="w-4 h-4 text-pink-600" />
          <span>Enviar mensaje de ánimo inmediato a la pantalla de {childName}:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {PRESET_NOTES.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onSendNote(preset)}
              className="bg-white hover:bg-pink-100/70 border border-pink-200 text-pink-950 font-semibold text-xs px-3 py-1 rounded-xl transition shadow-xs"
            >
              {preset}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmitCustomNote} className="flex gap-2">
          <input
            type="text"
            placeholder={`Escribe una nota personalizada para ${childName}...`}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold px-4 py-2 rounded-2xl shadow-sm flex items-center gap-1 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Nota</span>
          </button>
        </form>
      </div>
    </div>
  );
};
