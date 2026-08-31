import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusTimerProps {
  initialMinutes: number;
  taskTitle: string;
  onFinish: () => void;
  onClose: () => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  initialMinutes,
  taskTitle,
  onFinish,
  onClose
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const addMinutes = (mins: number) => {
    const added = mins * 60;
    setTotalSeconds((prev) => prev + added);
    setSecondsLeft((prev) => prev + added);
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 to-emerald-50/50 rounded-3xl p-6 border border-teal-100 shadow-lg text-center relative my-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
          <Clock className="w-5 h-5 text-teal-600 animate-spin-slow" />
          <span>Temporizador de Enfoque Visual</span>
        </div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium underline"
        >
          Cerrar
        </button>
      </div>

      <h3 className="text-base font-semibold text-slate-800 mb-4 line-clamp-1">
        {taskTitle}
      </h3>

      {/* Reloj Grande y Barra de Progreso Visual (Evita Ceguera del Tiempo TDAH) */}
      <div className="relative my-6 max-w-xs mx-auto">
        <div className="text-5xl font-extrabold font-mono text-teal-700 tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-teal-100 h-3.5 rounded-full overflow-hidden mt-4 p-0.5 border border-teal-200">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Botones de Control */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 ${
            isRunning
              ? 'bg-amber-500 text-white shadow-amber-200 hover:bg-amber-600'
              : 'bg-teal-600 text-white shadow-teal-200 hover:bg-teal-700'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{secondsLeft === totalSeconds ? 'Iniciar Enfoque' : 'Continuar'}</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-3 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition"
          title="Reiniciar temporizador"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Minutos Extra & Marcar Completada */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-teal-100 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Añadir tiempo:</span>
          <button
            onClick={() => addMinutes(5)}
            className="bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 px-2.5 py-1 rounded-lg font-semibold"
          >
            +5m
          </button>
          <button
            onClick={() => addMinutes(10)}
            className="bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 px-2.5 py-1 rounded-lg font-semibold"
          >
            +10m
          </button>
        </div>

        <button
          onClick={onFinish}
          className="flex items-center gap-1.5 text-emerald-700 font-bold hover:underline bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200 ml-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>¡Terminé Tarea!</span>
        </button>
      </div>
    </div>
  );
};
