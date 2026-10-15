import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { FuelLog, FuelType } from '../../types';
import { Fuel, X } from 'lucide-react';

interface FuelModalProps {
  onClose: () => void;
  fuelLogToEdit?: FuelLog | null;
  defaultVehicleId?: string;
}

export const FuelModal: React.FC<FuelModalProps> = ({
  onClose,
  fuelLogToEdit,
  defaultVehicleId,
}) => {
  const { vehicles, drivers, addFuelLog, updateFuelLog, isOwner, currentUser, showToast } = useGarage();

  const isEditing = !!fuelLogToEdit;

  // Find driver's vehicle if logged in as driver
  const currentDriver = drivers.find((d) => d.id === currentUser.driverId);
  const driverAssignedVeh = vehicles.find(
    (v) => v.id === currentDriver?.assignedVehicleId || v.assignedDriverId === currentDriver?.id
  );

  const [vehicleId, setVehicleId] = useState(
    fuelLogToEdit?.vehicleId || defaultVehicleId || driverAssignedVeh?.id || vehicles[0]?.id || ''
  );
  const [date, setDate] = useState(
    fuelLogToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [mileage, setMileage] = useState(
    fuelLogToEdit?.mileage || vehicles.find((v) => v.id === vehicleId)?.currentMileage || 50000
  );
  const [liters, setLiters] = useState(fuelLogToEdit?.liters || 50);
  const [totalPrice, setTotalPrice] = useState(fuelLogToEdit?.totalPrice || 65000);
  const [station, setStation] = useState(fuelLogToEdit?.station || 'YPF en Ruta');
  const [fuelType, setFuelType] = useState<FuelType>(
    fuelLogToEdit?.fuelType || vehicles.find((v) => v.id === vehicleId)?.fuelType || 'diesel'
  );
  const [fullTank, setFullTank] = useState(fuelLogToEdit ? fuelLogToEdit.fullTank : true);
  const [notes, setNotes] = useState(fuelLogToEdit?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (fuelLogToEdit) {
      setVehicleId(fuelLogToEdit.vehicleId);
      setDate(fuelLogToEdit.date);
      setMileage(fuelLogToEdit.mileage);
      setLiters(fuelLogToEdit.liters);
      setTotalPrice(fuelLogToEdit.totalPrice);
      setStation(fuelLogToEdit.station);
      setFuelType(fuelLogToEdit.fuelType);
      setFullTank(fuelLogToEdit.fullTank);
      setNotes(fuelLogToEdit.notes || '');
    }
  }, [fuelLogToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && !isOwner) {
      showToast('Solo el administrador puede modificar cargas de combustible anteriores.', 'error');
      return;
    }

    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    setIsSubmitting(true);
    try {
      const pricePerL = liters > 0 ? totalPrice / liters : 1300;
      const payload = {
        vehicleId,
        vehicleName: `${veh.brand} ${veh.model} (${veh.plate})`,
        date,
        mileage: Number(mileage),
        liters: Number(liters),
        totalPrice: Number(totalPrice),
        pricePerLiter: pricePerL,
        station: station.trim(),
        fuelType,
        fullTank,
        notes: notes.trim() || undefined,
      };

      if (isEditing && fuelLogToEdit) {
        updateFuelLog(fuelLogToEdit.id, payload);
      } else {
        addFuelLog(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Carga de Combustible' : 'Registrar Carga de Combustible'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Cargá los litros, odómetro y costo para el control de consumo.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Vehículo <span className="text-rose-500">*</span>
              </label>
              <select
                value={vehicleId}
                onChange={(e) => {
                  setVehicleId(e.target.value);
                  const v = vehicles.find((x) => x.id === e.target.value);
                  if (v) {
                    setFuelType(v.fuelType);
                    setMileage(v.currentMileage);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.plate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Litros Cargados <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                required
                value={liters}
                onChange={(e) => setLiters(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Importe Total ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={totalPrice}
                onChange={(e) => setTotalPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kilometraje Odómetro <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estación de Servicio
              </label>
              <input
                type="text"
                placeholder="YPF Ruta 9, Shell, Axion..."
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo de Combustible
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold capitalize"
              >
                <option value="diesel">Diésel Grado 3</option>
                <option value="nafta">Nafta Súper / Premium</option>
                <option value="gnc">GNC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observaciones</label>
            <input
              type="text"
              placeholder="Tarjeta de flota YPF Ruta, consumo promedio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#DCE3ED] text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Carga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
