import React from 'react';
import { useGarage } from '../../context/GarageContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useGarage();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-8 inset-x-0 z-50 flex flex-col items-center justify-center gap-2 pointer-events-none px-4">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 border-slate-700 text-white';
        let Icon = Info;

        if (toast.type === 'success') {
          bg = 'bg-emerald-950 border-emerald-700/60 text-emerald-200';
          Icon = CheckCircle2;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950 border-amber-700/60 text-amber-200';
          Icon = AlertTriangle;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-950 border-rose-700/60 text-rose-200';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur text-xs sm:text-sm font-medium transition animate-in fade-in slide-in-from-bottom-2 max-w-md w-auto text-center mx-auto ${bg}`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <p className="leading-snug text-center">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};
