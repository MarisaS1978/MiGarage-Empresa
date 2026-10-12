import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Incident, IncidentType, IncidentStatus } from '../../types';
import { AlertTriangle, X, Shield } from 'lucide-react';

interface IncidentModalProps {
  onClose: () => void;
  incidentToEdit?: Incident | null;
  defaultVehicleId?: string;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  onClose,
  incidentToEdit,
  defaultVehicleId,
}) => {
  const {
    vehicles,
    drivers,
    addIncident,
    updateIncident,
    openShareInsurance,
    isOwner,
    currentUser,
    showToast,
  } = useGarage();

  const isEditing = !!incidentToEdit;

  // Find driver's vehicle if logged in as driver
  const currentDriver = drivers.find((d) => d.id === currentUser.driverId);
  const driverAssignedVeh = vehicles.find(
    (v) => v.id === currentDriver?.assignedVehicleId || v.assignedDriverId === currentDriver?.id
  );

  const [vehicleId, setVehicleId] = useState(
    incidentToEdit?.vehicleId || defaultVehicleId || driverAssignedVeh?.id || vehicles[0]?.id || ''
  );
  const [date, setDate] = useState(
    incidentToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState(incidentToEdit?.time || '10:30');
  const [type, setType] = useState<IncidentType>(incidentToEdit?.type || 'choque');
  const [location, setLocation] = useState(
    incidentToEdit?.location || 'Ruta / Calle'
  );
  const [description, setDescription] = useState(incidentToEdit?.description || '');
  const [status, setStatus] = useState<IncidentStatus>(
    incidentToEdit?.status || 'denunciado'
  );
  const [claimNumber, setClaimNumber] = useState(incidentToEdit?.claimNumber || '');
  const [driverId, setDriverId] = useState(
    incidentToEdit?.driverId || currentDriver?.id || ''
  );
  const [estimatedCost, setEstimatedCost] = useState(incidentToEdit?.estimatedCost || 250000);
  const [daysOutOfService, setDaysOutOfService] = useState(incidentToEdit?.daysOutOfService || 3);
  const [thirdName, setThirdName] = useState(incidentToEdit?.thirdParty?.name || '');
  const [thirdPhone, setThirdPhone] = useState(incidentToEdit?.thirdParty?.phone || '');
  const [thirdPlate, setThirdPlate] = useState(incidentToEdit?.thirdParty?.plate || '');
  const [thirdInsurance, setThirdInsurance] = useState(
    incidentToEdit?.thirdParty?.insuranceCompany || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (incidentToEdit) {
      setVehicleId(incidentToEdit.vehicleId);
      setDate(incidentToEdit.date);
      setTime(incidentToEdit.time);
      setType(incidentToEdit.type);
      setLocation(incidentToEdit.location);
      setDescription(incidentToEdit.description);
      setStatus(incidentToEdit.status);
      setClaimNumber(incidentToEdit.claimNumber || '');
      setDriverId(incidentToEdit.driverId || '');
      setEstimatedCost(incidentToEdit.estimatedCost || 0);
      setDaysOutOfService(incidentToEdit.daysOutOfService || 0);
      if (incidentToEdit.thirdParty) {
        setThirdName(incidentToEdit.thirdParty.name);
        setThirdPhone(incidentToEdit.thirdParty.phone);
        setThirdPlate(incidentToEdit.thirdParty.plate || '');
        setThirdInsurance(incidentToEdit.thirdParty.insuranceCompany || '');
      }
    }
  }, [incidentToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && !isOwner) {
      showToast('Solo el administrador o propietario puede modificar siniestros registrados.', 'error');
      return;
    }

    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    const assignedDrv = drivers.find((d) => d.id === driverId);

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId,
        vehicleName: `${veh.brand} ${veh.model} (${veh.plate})`,
        date,
        time,
        location: location.trim(),
        type,
        description: description.trim(),
        status,
        claimNumber: claimNumber.trim() || undefined,
        driverId: driverId || undefined,
        driverName: assignedDrv ? assignedDrv.name : veh.assignedDriverName || undefined,
        estimatedCost: Number(estimatedCost),
        daysOutOfService: Number(daysOutOfService),
        photosCount: incidentToEdit ? incidentToEdit.photosCount : 4,
        thirdParty: thirdName.trim()
          ? {
              name: thirdName.trim(),
              phone: thirdPhone.trim(),
              plate: thirdPlate.trim().toUpperCase() || undefined,
              insuranceCompany: thirdInsurance.trim() || undefined,
            }
          : undefined,
      };

      if (isEditing && incidentToEdit) {
        updateIncident(incidentToEdit.id, payload);
      } else {
        addIncident(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-xl p-4 sm:p-6 md:p-7 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Registro de Siniestro' : 'Denunciar Siniestro de Flota'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Cargá los datos del choque, daños materiales, conductor y terceros involucrados.
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
                  if (v?.assignedDriverId) setDriverId(v.assignedDriverId);
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
                Conductor al Momento del Hecho
              </label>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold"
              >
                <option value="">(Sin asignar / Conductor externo)</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.dni})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo de Siniestro <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold capitalize"
              >
                <option value="choque">Choque / Colisión</option>
                <option value="daño estacionado">Daño estacionado</option>
                <option value="accidente">Vuelco / Accidente</option>
                <option value="robo">Robo total / parcial</option>
                <option value="daño climático">Granizo / Inundación</option>
                <option value="otro">Otro</option>
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lugar del Hecho <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Panamericana Km 34, San Isidro"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Estado del Reclamo
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IncidentStatus)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold"
              >
                <option value="denunciado">Denunciado a Aseguradora</option>
                <option value="en investigación">En Peritaje / Investigación</option>
                <option value="en reparación">En Taller de Chapa y Pintura</option>
                <option value="resuelto">Resuelto e Indemnizado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                N° de Denuncia de Seguro
              </label>
              <input
                type="text"
                placeholder="DEN-2026-9941"
                value={claimNumber}
                onChange={(e) => setClaimNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Costo Estimado de Reparación ($)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descripción de los Daños y Mecánica del Accidente <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Explicá cómo ocurrió el siniestro y qué partes resultaron dañadas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
            />
          </div>

          {/* Tercero involucrado */}
          <div className="p-3.5 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <div className="font-bold text-slate-800 text-xs">Datos del Tercero Involucrado (si hubo)</div>
              {vehicleId && (
                <button
                  type="button"
                  onClick={() => openShareInsurance(vehicleId)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition"
                  title="Compartir datos de mi póliza y auxilio con el otro conductor"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Compartir mi Seguro</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="text"
                placeholder="Nombre y Apellido del tercero"
                value={thirdName}
                onChange={(e) => setThirdName(e.target.value)}
                className="p-2 rounded-xl bg-white border border-[#DCE3ED] text-slate-900"
              />
              <input
                type="text"
                placeholder="Teléfono móvil"
                value={thirdPhone}
                onChange={(e) => setThirdPhone(e.target.value)}
                className="p-2 rounded-xl bg-white border border-[#DCE3ED] text-slate-900"
              />
              <input
                type="text"
                placeholder="Patente del vehículo tercero"
                value={thirdPlate}
                onChange={(e) => setThirdPlate(e.target.value)}
                className="p-2 rounded-xl bg-white border border-[#DCE3ED] text-slate-900 uppercase font-mono"
              />
              <input
                type="text"
                placeholder="Compañía aseguradora tercero"
                value={thirdInsurance}
                onChange={(e) => setThirdInsurance(e.target.value)}
                className="p-2 rounded-xl bg-white border border-[#DCE3ED] text-slate-900"
              />
            </div>
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
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Siniestro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
