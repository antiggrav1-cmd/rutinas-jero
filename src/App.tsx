import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Header } from './components/Header';
import { HijoView } from './components/HijoView';
import { MamaView } from './components/MamaView';
import { SyncIndicator } from './components/SyncIndicator';
import { useSync } from './hooks/useSync';
import { Smartphone, Download, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const { currentRole, settings, checkDailyRollover } = useAppStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { status: syncStatus } = useSync();

  useEffect(() => {
    // Ejecutar chequeo diario inteligente de rutinas y racha
    checkDailyRollover();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [checkDailyRollover]);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-200">
      
      {/* Encabezado Superior */}
      <Header />

      {/* Banner de Instalación PWA (Móvil / Escritorio) */}
      {isInstallable && (
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 text-white px-4 py-2.5 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>Instala la App en tu pantalla de inicio para usarla offline como una App nativa.</span>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-white text-teal-800 font-extrabold px-3.5 py-1 rounded-xl text-xs hover:bg-emerald-50 shrink-0 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 inline-block mr-1" />
              Instalar PWA
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1">
        {currentRole === 'mama' ? <MamaView /> : <HijoView />}
      </main>

      {/* Pie de Página */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SyncIndicator status={syncStatus} />
            <span>Familia {settings.familyCode}</span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-slate-500">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline-block" />
            <span>Diseñado para {settings.childName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
