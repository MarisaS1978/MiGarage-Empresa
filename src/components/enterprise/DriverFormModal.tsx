import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Driver } from '../../types';
import { Users, X, AlertCircle } from 'lucide-react';

interface DriverFormModalProps {
  onClose: () => void;
  driverToEdit?: Driver | null;
}

export const DriverFormModal: React.FC<DriverFormModalProps> = ({ onClose, driverToEdit }) => {
  const { addDriver, updateDriver, vehicles, isOwner, showToast } = useGarage();

  const isEditing = !!driverToEdit;

  const [name, setName] = useState(driverToEdit?.name || '');
  const [dni, setDni] = useState(driverToEdit?.dni || '');
  const [phone, setPhone] = useState(driverToEdit?.phone || '');
  const [email, setEmail] = useState(driverToEdit?.email || '');
  const [licenseNumber, setLicenseNumber] = useState(driverToEdit?.licenseNumber || '');
  const [licenseCategory, setLicenseCategory] = useState(
    driverToEdit?.licenseCategory || 'B1 (Automóviles y utilitarios hasta 3500kg)'
  );
  const [licenseExpiry, setLicenseExpiry] = useState(driverToEdit?.licenseExpiry || '2027-10-01');
  const [status, setStatus] = useState<'activo' | 'licencia' | 'inactivo'>(
    driverToEdit?.status || 'activo'
  );
  const [assignedVehicleId, setAssignedVehicleId] = useState(
    driverToEdit?.assignedVehicleId || ''
  );
  const [notes, setNotes] = useState(driverToEdit?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (driverToEdit) {
      setName(driverToEdit.name);
      setDni(driverToEdit.dni);
      setPhone(driverToEdit.phone);
      setEmail(driverToEdit.email);
      setLicenseNumber(driverToEdit.licenseNumber);
      setLicenseCategory(driverToEdit.licenseCategory);
      setLicenseExpiry(driverToEdit.licenseExpiry);
      setStatus(driverToEdit.status);
      setAssignedVehicleId(driverToEdit.assignedVehicleId || '');
      setNotes(driverToEdit.notes || '');
    }
  }, [driverToEdit]);

  // Check if target vehicle already has another driver
  const targetVehicle = vehicles.find((v) => v.id === assignedVehicleId);
  const vehicleAlreadyHasOtherDriver =
    targetVehicle &&
    targetVehicle.assignedDriverId &&
    (!driverToEdit || targetVehicle.assignedDriverId !== driverToEdit.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      showToast('Solo el propietario puede registrar o modificar conductores.', 'error');
      return;
    }

    if (!name.trim() || !dni.trim() || !licenseNumber.trim()) {
      showToast('Completá los campos obligatorios: Nombre, DNI y Número de licencia.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        dni: dni.trim(),
        phone: phone.trim(),
        email: email.trim(),
        licenseNumber: licenseNumber.trim(),
        licenseCategory,
        licenseExpiry,
        status,
        assignedVehicleId: assignedVehicleId || undefined,
        notes: notes.trim() || undefined,
      };

      if (isEditing && driverToEdit) {
        const ok = updateDriver(driverToEdit.id, payload);
        if (ok) onClose();
      } else {
        const ok = addDriver(payload);
        if (ok) onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl border border-slate-200 my-8">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Ficha de Conductor' : 'Registrar Conductor de Flota'}
            </h3>
            <p className="text-xs text-[#64748B]">
              {isEditing
                ? `Actualizá la documentación, licencia y vehículo asignado para ${driverToEdit.name}.`
                : 'Cargá los datos del chofer, licencia profesional y asignación.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-5">
          {/* Nombre y DNI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Nombre y Apellido <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Marcelo Gómez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                DNI <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 32.441.982"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Teléfono y Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Teléfono Móvil</label>
              <input
                type="text"
                placeholder="+54 9 11 5566-7788"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="chofer@transporte-sa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Licencia y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                N° de Licencia Nacional <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="B-32441982"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono font-bold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Categoría</label>
              <select
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              >
                <option value="B1 (Automóviles y utilitarios hasta 3500kg)">
                  B1 (Autos y utilitarios hasta 3500kg)
                </option>
                <option value="C (Camiones sin acoplado)">C (Camiones sin acoplado)</option>
                <option value="D1 (Transporte de pasajeros hasta 8 plazas)">
                  D1 (Pasajeros hasta 8 plazas)
                </option>
                <option value="E1 (Cargas Pesadas y Acoplados)">
                  E1 (Cargas Pesadas y Acoplados)
                </option>
                <option value="E2 (Maquinaria especial no agrícola)">E2 (Maquinaria especial)</option>
              </select>
            </div>
          </div>

          {/* Vencimiento y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Vencimiento de Licencia <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Estado Operativo</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'activo' | 'licencia' | 'inactivo')}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              >
                <option value="activo">🟢 Activo / En Servicio</option>
                <option value="licencia">🟡 Licencia Médica / Vacaciones</option>
                <option value="inactivo">🔴 Inactivo / Suspendido</option>
              </select>
            </div>
          </div>

          {/* Vehículo Asignado */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">
              Vehículo asignado
            </label>
            <select
              value={assignedVehicleId}
              onChange={(e) => setAssignedVehicleId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
            >
              <option value="">(Sin asignar)</option>
              {vehicles.map((v) => {
                const isOccupied =
                  v.assignedDriverId && (!driverToEdit || v.assignedDriverId !== driverToEdit.id);
                return (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.plate}) — {v.costCenter || 'Flota'}
                    {isOccupied ? ` [Asignado a: ${v.assignedDriverName}]` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {vehicleAlreadyHasOtherDriver && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">Aviso de reemplazo:</span> La unidad{' '}
                <strong>
                  {targetVehicle.brand} {targetVehicle.model} ({targetVehicle.plate})
                </strong>{' '}
                actualmente está asignada a <strong>{targetVehicle.assignedDriverName}</strong>. Al
                guardar, se transferirá a este chofer y el chofer anterior quedará sin unidad.
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">Observaciones</label>
            <textarea
              rows={2}
              placeholder="Cursos aprobados, historial de rutas o notas de legajo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE3ED]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#DCE3ED] text-[#1E293B] hover:bg-slate-100 font-semibold transition cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <span>
                {isSubmitting
                  ? 'Guardando...'
                  : isEditing
                  ? 'Guardar Cambios'
                  : 'Registrar Conductor'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
