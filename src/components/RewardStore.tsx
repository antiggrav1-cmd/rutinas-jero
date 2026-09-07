import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Gift, Star, Plus, Trash2, Check, Clock, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { notificationService } from '../services/notificationService';

interface RewardStoreProps {
  isMamaRole?: boolean;
}

export const RewardStore: React.FC<RewardStoreProps> = ({ isMamaRole = false }) => {
  const { 
    rewards, 
    pointsBalance, 
    redeemReward, 
    addReward, 
    deleteReward, 
    settings,
    approveRewardRedemption,
    rejectRewardRedemption
  } = useAppStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [costPoints, setCostPoints] = useState(50);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const pendingRequests = settings.pendingRewardRequests || [];

  const handleRedeem = (rewardId: string, cost: number, rewardTitle: string) => {
    if (pointsBalance >= cost) {
      const success = redeemReward(rewardId);
      if (success) {
        notificationService.playSuccessChime();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 }
        });
        setRedeemSuccess(rewardTitle);
        setTimeout(() => setRedeemSuccess(null), 4000);
      }
    }
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReward({
      title,
      costPoints: Number(costPoints),
      icon: 'gift'
    });
    setTitle('');
    setCostPoints(50);
    setShowAddForm(false);
  };

  return (
    <div className="bg-gradient-to-b from-amber-50/50 to-orange-50/30 rounded-3xl p-5 border border-amber-100/80 my-6">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400 text-amber-950 p-2 rounded-2xl shadow-sm">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tienda de Recompensas</h2>
            <p className="text-xs text-slate-500 font-medium">
              Canjea tus puntos acumulados por premios acordados con mamá
            </p>
          </div>
        </div>

        {isMamaRole && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Recompensa</span>
          </button>
        )}
      </div>

      {/* BLOQUE DE SOLICITUDES PENDIENTES DE RECOMPENSAS (REVISIÓN DE MAMÁ) */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-100/80 border border-amber-300 rounded-3xl p-4 mb-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm">
              <Clock className="w-4 h-4 text-amber-700 animate-spin-slow" />
              <span>
                {isMamaRole
                  ? `📩 Solicitudes de Premios por Entregar a ${settings.childName} (${pendingRequests.length})`
                  : `⏳ Tienes ${pendingRequests.length} solicitud(es) enviada(s) a Mamá`}
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
              Puntos reservados
            </span>
          </div>

          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl p-3 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                    <span>🎁 {req.rewardTitle}</span>
                  </div>
                  <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                    Costo: {req.costPoints} pts
                  </div>
                </div>

                {isMamaRole ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        approveRewardRedemption(req.id);
                        notificationService.playSuccessChime();
                        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
                      }}
                      className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aprobar y Entregar</span>
                    </button>
                    <button
                      onClick={() => {
                        rejectRewardRedemption(req.id);
                        notificationService.playAttentionChime();
                      }}
                      className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-rose-200 transition flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Devolver Puntos</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                    Esperando entrega de Mamá ⏳
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {redeemSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 mb-4 animate-bounce">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>¡Solicitud Enviada! Pediste: &quot;{redeemSuccess}&quot;. Mamá la aprobará en breve.</span>
        </div>
      )}

      {showAddForm && isMamaRole && (
        <form onSubmit={handleCreateReward} className="bg-white p-4 rounded-2xl border border-amber-200 mb-4 space-y-3">
          <h4 className="text-xs font-bold text-amber-900">Agregar nuevo premio a la tienda</h4>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Premio</label>
            <input
              type="text"
              placeholder="Ej. 1 Hora extra de parque"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Costo en Puntos</label>
            <input
              type="number"
              min={10}
              max={1000}
              step={5}
              value={costPoints}
              onChange={(e) => setCostPoints(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow"
            >
              Guardar Recompensa
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rewards.map((reward) => {
          const canAfford = pointsBalance >= reward.costPoints;
          const needed = reward.costPoints - pointsBalance;

          return (
            <div
              key={reward.id}
              className={`bg-white rounded-2xl p-4 border transition-all shadow-sm flex flex-col justify-between ${
                canAfford ? 'border-amber-200 hover:border-amber-400' : 'border-slate-100 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-bold text-sm text-slate-800 leading-snug">
                    {reward.title}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-900 font-extrabold text-xs px-2.5 py-1 rounded-full shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{reward.costPoints} pts</span>
                  </div>
                </div>

                {reward.redeemedCount > 0 && (
                  <p className="text-[11px] text-emerald-700 font-semibold mb-2">
                    Entregado {reward.redeemedCount} veces
                  </p>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                {isMamaRole ? (
                  <button
                    onClick={() => deleteReward(reward.id)}
                    className="text-xs text-rose-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                ) : canAfford ? (
                  <button
                    onClick={() => handleRedeem(reward.id, reward.costPoints, reward.title)}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl shadow-md shadow-amber-200 transition"
                  >
                    Solicitar a Mamá 🎁
                  </button>
                ) : (
                  <span className="w-full text-center text-xs font-semibold text-slate-400 bg-slate-100 py-1.5 rounded-xl">
                    Faltan {needed} pts
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
