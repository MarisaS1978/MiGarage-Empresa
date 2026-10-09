import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { MaintenanceRecord, MaintenanceType } from '../../types';
import { Wrench, X } from 'lucide-react';

interface MaintenanceFormModalProps {
  onClose: () => void;
  recordToEdit?: MaintenanceRecord | null;
  defaultVehicleId?: string;
}

export const MaintenanceFormModal: React.FC<MaintenanceFormModalProps> = ({
  onClose,
  recordToEdit,
  defaultVehicleId,
}) => {
  const { vehicles, workshops, addMaintenanceRecord, updateMaintenanceRecord, isOwner, showToast } =
    useGarage();

  const isEditing = !!recordToEdit;

  const [vehicleId, setVehicleId] = useState(
    recordToEdit?.vehicleId || defaultVehicleId || vehicles[0]?.id || ''
  );
  const [date, setDate] = useState(
    recordToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [mileage, setMileage] = useState(
    recordToEdit?.mileage || vehicles.find((v) => v.id === vehicleId)?.currentMileage || 50000
  );
  const [type, setType] = useState<MaintenanceType>(recordToEdit?.type || 'cambio de aceite');
  const [description, setDescription] = useState(recordToEdit?.description || '');
  const [workshop, setWorkshop] = useState(recordToEdit?.workshop || workshops[0]?.name || '');
  const [cost, setCost] = useState(recordToEdit?.cost || 120000);
  const [partsCost, setPartsCost] = useState(recordToEdit?.partsCost || 75000);
  const [laborCost, setLaborCost] = useState(recordToEdit?.laborCost || 45000);
  const [downtimeHours, setDowntimeHours] = useState(recordToEdit?.downtimeHours || 4);
  const [responsible, setResponsible] = useState(recordToEdit?.responsible || '');
  const [invoiceNumber, setInvoiceNumber] = useState(recordToEdit?.invoiceNumber || '');
  const [isPreventive, setIsPreventive] = useState(
    recordToEdit ? !!recordToEdit.isPreventive : true
  );
  const [notes, setNotes] = useState(recordToEdit?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (recordToEdit) {
      setVehicleId(recordToEdit.vehicleId);
      setDate(recordToEdit.date);
      setMileage(recordToEdit.mileage);
      setType(recordToEdit.type);
      setDescription(recordToEdit.description);
      setWorkshop(recordToEdit.workshop);
      setCost(recordToEdit.cost);
      setPartsCost(recordToEdit.partsCost || 0);
      setLaborCost(recordToEdit.laborCost || 0);
      setDowntimeHours(recordToEdit.downtimeHours || 0);
      setResponsible(recordToEdit.responsible || '');
      setInvoiceNumber(recordToEdit.invoiceNumber || '');
      setIsPreventive(!!recordToEdit.isPreventive);
      setNotes(recordToEdit.notes || '');
    }
  }, [recordToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      showToast('Solo el propietario puede registrar o editar mantenimientos.', 'error');
      return;
    }

    const selectedVeh = vehicles.find((v) => v.id === vehicleId);
    if (!selectedVeh) return;

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId,
        vehicleName: `${selectedVeh.brand} ${selectedVeh.model} (${selectedVeh.plate})`,
        date,
        mileage: Number(mileage),
        type,
        description: description.trim(),
        workshop: workshop.trim(),
        cost: Number(cost),
        partsCost: Number(partsCost),
        laborCost: Number(laborCost),
        downtimeHours: Number(downtimeHours),
        responsible: responsible.trim() || undefined,
        invoiceNumber: invoiceNumber.trim() || undefined,
        isPreventive,
        notes: notes.trim() || undefined,
      };

      if (isEditing && recordToEdit) {
        const ok = updateMaintenanceRecord(recordToEdit.id, payload);
        if (ok) onClose();
      } else {
        const ok = addMaintenanceRecord(payload);
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
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Intervención de Mantenimiento' : 'Registrar Mantenimiento'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Cargá los detalles del service, taller, repuestos y costos.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-5">
          {/* Vehículo y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Vehículo <span className="text-rose-500">*</span>
              </label>
              <select
                value={vehicleId}
                onChange={(e) => {
                  setVehicleId(e.target.value);
                  const veh = vehicles.find((v) => v.id === e.target.value);
                  if (veh) setMileage(veh.currentMileage);
                }}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.plate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Fecha del Servicio <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono"
              />
            </div>
          </div>

          {/* Tipo de Mantenimiento y Kilometraje */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Tipo de Intervención <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaintenanceType)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold capitalize"
              >
                <option value="cambio de aceite">Cambio de aceite y filtros</option>
                <option value="frenos">Frenos y pastillas</option>
                <option value="neumáticos">Neumáticos y alineación</option>
                <option value="batería">Batería y electricidad</option>
                <option value="suspensión">Suspensión y tren delantero</option>
                <option value="distribución">Distribución y correas</option>
                <option value="service general">Service oficial general</option>
                <option value="aire acondicionado">Aire acondicionado</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Kilometraje del Odómetro <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono font-bold"
              />
            </div>
          </div>

          {/* Taller / Proveedor y Tipo Preventivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Taller / Proveedor <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="workshops-list"
                placeholder="Nombre del taller o proveedor"
                value={workshop}
                onChange={(e) => setWorkshop(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B]"
              />
              <datalist id="workshops-list">
                {workshops.map((ws) => (
                  <option key={ws.id} value={ws.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Naturaleza</label>
              <div className="flex items-center gap-3 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPreventive"
                    checked={isPreventive}
                    onChange={() => setIsPreventive(true)}
                    className="accent-[#2563EB]"
                  />
                  <span>Preventivo / Programado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPreventive"
                    checked={!isPreventive}
                    onChange={() => setIsPreventive(false)}
                    className="accent-[#2563EB]"
                  />
                  <span>Correctivo / Rotura</span>
                </label>
              </div>
            </div>
          </div>

          {/* Costos: Total, Repuestos, Mano de obra */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Costo Total ($)</label>
              <input
                type="number"
                min="0"
                required
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Costo Repuestos ($)</label>
              <input
                type="number"
                min="0"
                value={partsCost}
                onChange={(e) => setPartsCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Mano de Obra ($)</label>
              <input
                type="number"
                min="0"
                value={laborCost}
                onChange={(e) => setLaborCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono"
              />
            </div>
          </div>

          {/* Horas de parada y Factura */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Horas Fuera de Servicio (Parada)
              </label>
              <input
                type="number"
                min="0"
                value={downtimeHours}
                onChange={(e) => setDowntimeHours(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">N° de Factura / Remito</label>
              <input
                type="text"
                placeholder="FC-A-0001-0004521"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B]"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">
              Descripción del Trabajo Realizado <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Detallá los trabajos, repuestos instalados o pruebas efectuadas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B]"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE3ED]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#DCE3ED] text-[#1E293B] hover:bg-slate-100 font-semibold cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-900/20 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Mantenimiento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
