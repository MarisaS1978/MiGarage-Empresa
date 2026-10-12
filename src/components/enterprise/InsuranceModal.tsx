import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { InsurancePolicy } from '../../types';
import { Shield, X } from 'lucide-react';

interface InsuranceModalProps {
  onClose: () => void;
  policyToEdit?: InsurancePolicy | null;
  defaultVehicleId?: string;
}

export const InsuranceModal: React.FC<InsuranceModalProps> = ({
  onClose,
  policyToEdit,
  defaultVehicleId,
}) => {
  const { vehicles, addInsurancePolicy, updateInsurancePolicy, isOwner, showToast } = useGarage();

  const isEditing = !!policyToEdit;

  const [vehicleId, setVehicleId] = useState(
    policyToEdit?.vehicleId || defaultVehicleId || vehicles[0]?.id || ''
  );
  const [company, setCompany] = useState(policyToEdit?.company || 'Sancor Seguros');
  const [policyNumber, setPolicyNumber] = useState(policyToEdit?.policyNumber || '');
  const [coverageType, setCoverageType] = useState(
    policyToEdit?.coverageType || 'Todo Riesgo con Franquicia Fija 3%'
  );
  const [startDate, setStartDate] = useState(
    policyToEdit?.startDate || new Date().toISOString().split('T')[0]
  );
  const [expiryDate, setExpiryDate] = useState(
    policyToEdit?.expiryDate || '2027-01-15'
  );
  const [assistancePhone, setAssistancePhone] = useState(
    policyToEdit?.assistancePhone || '0800-555-2850'
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    policyToEdit?.emergencyPhone || '0800-777-4648'
  );
  const [monthlyPremium, setMonthlyPremium] = useState(
    policyToEdit?.monthlyPremium || 95000
  );
  const [notes, setNotes] = useState(policyToEdit?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (policyToEdit) {
      setVehicleId(policyToEdit.vehicleId);
      setCompany(policyToEdit.company);
      setPolicyNumber(policyToEdit.policyNumber);
      setCoverageType(policyToEdit.coverageType);
      setStartDate(policyToEdit.startDate);
      setExpiryDate(policyToEdit.expiryDate);
      setAssistancePhone(policyToEdit.assistancePhone);
      setEmergencyPhone(policyToEdit.emergencyPhone);
      setMonthlyPremium(policyToEdit.monthlyPremium || 0);
      setNotes(policyToEdit.notes || '');
    }
  }, [policyToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      showToast('Solo el propietario puede registrar o editar pólizas de seguro.', 'error');
      return;
    }

    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId,
        vehicleName: `${veh.brand} ${veh.model} (${veh.plate})`,
        company: company.trim(),
        policyNumber: policyNumber.trim(),
        coverageType: coverageType.trim(),
        startDate,
        expiryDate,
        assistancePhone: assistancePhone.trim(),
        emergencyPhone: emergencyPhone.trim(),
        monthlyPremium: Number(monthlyPremium),
        notes: notes.trim() || undefined,
      };

      if (isEditing && policyToEdit) {
        updateInsurancePolicy(policyToEdit.id, payload);
      } else {
        addInsurancePolicy(payload);
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
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Póliza de Seguro' : 'Registrar Seguro Corporativo'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Cargá la aseguradora, números de póliza y asistencia en ruta.
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
                onChange={(e) => setVehicleId(e.target.value)}
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
                Aseguradora <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Sancor Seguros, La Segunda, Federación Patronal"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                N° de Póliza <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="SNC-FLOTA-44021"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo de Cobertura
              </label>
              <input
                type="text"
                placeholder="Todo Riesgo / Terceros Completo"
                value={coverageType}
                onChange={(e) => setCoverageType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha Inicio Vigencia <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha Vencimiento <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Auxilio Mecánico 24h
              </label>
              <input
                type="text"
                placeholder="0800-555-2850"
                value={assistancePhone}
                onChange={(e) => setAssistancePhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Emergencias / Denuncias
              </label>
              <input
                type="text"
                placeholder="0800-777-4648"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Cuota Mensual ($)
              </label>
              <input
                type="number"
                min="0"
                value={monthlyPremium}
                onChange={(e) => setMonthlyPremium(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notas / Franquicia</label>
            <textarea
              rows={2}
              placeholder="Detalles sobre grúa sin límite, franquicia fija..."
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
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Póliza'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
