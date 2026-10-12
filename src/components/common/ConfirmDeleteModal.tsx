import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  itemSubtitle?: string;
  warningDetails?: string[];
  confirmButtonText?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemSubtitle,
  warningDetails = [],
  confirmButtonText = 'Sí, eliminar',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="font-extrabold text-slate-900 text-sm">{itemName}</div>
          {itemSubtitle && (
            <div className="text-xs text-slate-500 font-mono mt-0.5">{itemSubtitle}</div>
          )}
        </div>

        {warningDetails.length > 0 && (
          <div className="mt-3 space-y-1.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Registros relacionados detectados:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800 pl-1">
              {warningDetails.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
            <p className="text-[11px] text-amber-700 pt-1 border-t border-amber-200/60 font-medium">
              Los registros históricos se conservarán para trazabilidad y auditoría.
            </p>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-3">
          ¿Estás seguro de que deseás continuar? Esta operación no se puede deshacer.
        </p>

        <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-900/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Eliminando...' : confirmButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
