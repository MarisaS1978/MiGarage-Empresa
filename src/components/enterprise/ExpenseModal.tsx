import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Expense, ExpenseCategory } from '../../types';
import { Coins, X } from 'lucide-react';

interface ExpenseModalProps {
  onClose: () => void;
  expenseToEdit?: Expense | null;
  defaultVehicleId?: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  onClose,
  expenseToEdit,
  defaultVehicleId,
}) => {
  const { vehicles, addExpense, updateExpense, isOwner, showToast } = useGarage();

  const isEditing = !!expenseToEdit;

  const [vehicleId, setVehicleId] = useState(
    expenseToEdit?.vehicleId || defaultVehicleId || vehicles[0]?.id || ''
  );
  const [date, setDate] = useState(
    expenseToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    expenseToEdit?.category || 'otros'
  );
  const [description, setDescription] = useState(expenseToEdit?.description || '');
  const [amount, setAmount] = useState(expenseToEdit?.amount || 25000);
  const [vendor, setVendor] = useState(expenseToEdit?.vendor || '');
  const [costCenter, setCostCenter] = useState(
    expenseToEdit?.costCenter ||
      vehicles.find((v) => v.id === vehicleId)?.costCenter ||
      'Operaciones Logística'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      setVehicleId(expenseToEdit.vehicleId);
      setDate(expenseToEdit.date);
      setCategory(expenseToEdit.category);
      setDescription(expenseToEdit.description);
      setAmount(expenseToEdit.amount);
      setVendor(expenseToEdit.vendor || '');
      setCostCenter(expenseToEdit.costCenter || 'Operaciones Logística');
    }
  }, [expenseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      showToast('Solo el propietario puede registrar o editar gastos.', 'error');
      return;
    }

    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId,
        vehicleName: `${veh.brand} ${veh.model} (${veh.plate})`,
        date,
        category,
        description: description.trim(),
        amount: Number(amount),
        vendor: vendor.trim() || undefined,
        costCenter: costCenter.trim() || veh.costCenter,
      };

      if (isEditing && expenseToEdit) {
        updateExpense(expenseToEdit.id, payload);
      } else {
        addExpense(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Gasto Operativo' : 'Registrar Gasto de Flota'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Cargá el comprobante o gasto correspondiente a la unidad.
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
                  if (v?.costCenter) setCostCenter(v.costCenter);
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Categoría <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold capitalize"
              >
                <option value="combustible">Combustible</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="seguro">Seguro</option>
                <option value="documentación">Documentación / Tasas</option>
                <option value="peajes">Peajes</option>
                <option value="lavado">Lavado</option>
                <option value="neumáticos">Neumáticos</option>
                <option value="reparación">Reparación</option>
                <option value="otros">Otros gastos</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Monto ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Proveedor / Estación
              </label>
              <input
                type="text"
                placeholder="Ej: Shell, Autopistas, Concesionario..."
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Centro de Costo
              </label>
              <input
                type="text"
                value={costCenter}
                onChange={(e) => setCostCenter(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descripción del Gasto <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Detalle del comprobante o gasto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
