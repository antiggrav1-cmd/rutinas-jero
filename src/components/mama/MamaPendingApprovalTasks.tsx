import React from 'react';
import { Clock } from 'lucide-react';
import type { Task } from '../../types';
import { TaskCard } from '../TaskCard';

interface MamaPendingApprovalTasksProps {
  childName: string;
  pendingApprovalTasks: Task[];
}

export const MamaPendingApprovalTasks: React.FC<MamaPendingApprovalTasksProps> = ({
  childName,
  pendingApprovalTasks
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
          Tareas de {childName} Esperando tu Verificación ({pendingApprovalTasks.length})
        </h3>
      </div>

      {pendingApprovalTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-500">No hay tareas pendientes por aprobar en este momento.</p>
          <p className="text-xs text-slate-400 mt-1">Cuando {childName} termine sus pasos, aparecerán aquí para tu revisión.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovalTasks.map((task) => (
            <TaskCard key={task.id} task={task} isMamaRole={true} />
          ))}
        </div>
      )}
    </div>
  );
};
