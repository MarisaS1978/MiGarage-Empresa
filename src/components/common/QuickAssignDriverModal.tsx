import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Vehicle } from '../../types';
import { UserCheck, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QuickAssignDriverModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

export const QuickAssignDriverModal: React.FC<QuickAssignDriverModalProps> = ({
  vehicle,
  onClose,
}) => {
  const { drivers, vehicles, assignDriverToVehicle, showToast } = useGarage();

  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    vehicle.assignedDriverId || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected driver
  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);

  // If driver currently assigned to another vehicle
  const otherVehicle = selectedDriver
    ? vehicles.find((v) => v.assignedDriverId === selectedDriver.id && v.id !== vehicle.id)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = assignDriverToVehicle(vehicle.id, selectedDriverId || null);
      if (result.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDriverOption = (d: typeof drivers[0]) => {
    const cleanDni = d.dni.replace(/\D/g, '');
    const last3 = cleanDni.slice(-3);
    const suffix = last3 ? `DNI terminado en ${last3}` : `DNI ${d.dni}`;
    const isOtherAssigned = d.assignedVehicleId && d.assignedVehicleId !== vehicle.id;
    return `${d.name} — ${suffix}${isOtherAssigned ? ' (En otra unidad)' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold mb-3">
          <UserCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#172554]">
          Asignar Chofer a la Unidad
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          {vehicle.brand} {vehicle.model} —{' '}
          <span className="font-mono font-bold text-slate-800">{vehicle.plate}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4">
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1.5">
              Chofer asignado
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold text-xs focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
            >
              <option value="">(Sin asignar)</option>
              {drivers
                .filter((d) => d.status === 'activo' || d.id === vehicle.assignedDriverId)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {formatDriverOption(d)}
                  </option>
                ))}
            </select>
          </div>

          {/* Current assignment badge */}
          <div className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]">
            <div className="text-[11px] text-[#64748B]">Estado de asignación actual:</div>
            <div className="font-bold text-[#1E293B] mt-0.5">
              {vehicle.assignedDriverName ? (
                <span className="text-[#15803D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {vehicle.assignedDriverName}
                </span>
              ) : (
                <span className="text-slate-500">Sin chofer asignado</span>
              )}
            </div>
          </div>

          {/* Reassignment warning if driver already has another vehicle */}
          {otherVehicle && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold">Aviso de reasignación:</span>{' '}
                <strong>{selectedDriver?.name}</strong> ya tiene asignada la unidad{' '}
                <strong>
                  {otherVehicle.brand} {otherVehicle.model} ({otherVehicle.plate})
                </strong>
                . Al guardar, se transferirá a esta unidad ({vehicle.plate}).
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#DCE3ED] text-[#1E293B] hover:bg-slate-50 font-semibold transition cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Confirmar Asignación'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
