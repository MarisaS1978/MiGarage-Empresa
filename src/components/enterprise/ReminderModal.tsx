import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Reminder, ReminderCategory } from '../../types';
import { Bell, X } from 'lucide-react';

interface ReminderModalProps {
  onClose: () => void;
  reminderToEdit?: Reminder | null;
  defaultVehicleId?: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  onClose,
  reminderToEdit,
  defaultVehicleId,
}) => {
  const { vehicles, addReminder, updateReminder, isOwner, showToast } = useGarage();

  const isEditing = !!reminderToEdit;

  const [vehicleId, setVehicleId] = useState(
    reminderToEdit?.vehicleId || defaultVehicleId || vehicles[0]?.id || ''
  );
  const [title, setTitle] = useState(reminderToEdit?.title || '');
  const [category, setCategory] = useState<ReminderCategory>(
    reminderToEdit?.category || 'mantenimiento'
  );
  const [dueDate, setDueDate] = useState(reminderToEdit?.dueDate || '');
  const [dueMileage, setDueMileage] = useState<number | undefined>(
    reminderToEdit?.dueMileage || undefined
  );
  const [priority, setPriority] = useState<'alta' | 'media' | 'baja'>(
    reminderToEdit?.priority || 'alta'
  );
  const [notes, setNotes] = useState(reminderToEdit?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reminderToEdit) {
      setVehicleId(reminderToEdit.vehicleId);
      setTitle(reminderToEdit.title);
      setCategory(reminderToEdit.category);
      setDueDate(reminderToEdit.dueDate || '');
      setDueMileage(reminderToEdit.dueMileage);
      setPriority(reminderToEdit.priority);
      setNotes(reminderToEdit.notes || '');
    }
  }, [reminderToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      showToast('Solo el propietario puede registrar o editar recordatorios.', 'error');
      return;
    }

    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId,
        vehicleName: `${veh.brand} ${veh.model} (${veh.plate})`,
        title: title.trim(),
        category,
        dueDate: dueDate || undefined,
        dueMileage: dueMileage ? Number(dueMileage) : undefined,
        completed: reminderToEdit ? reminderToEdit.completed : false,
        priority,
        notes: notes.trim() || undefined,
      };

      if (isEditing && reminderToEdit) {
        updateReminder(reminderToEdit.id, payload);
      } else {
        addReminder(payload);
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
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Recordatorio' : 'Crear Recordatorio Preventivo'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Programá alertas por fecha límite o por odómetro en kilómetros.
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
                Categoría <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReminderCategory)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold capitalize"
              >
                <option value="mantenimiento">Mantenimiento</option>
                <option value="documentación">Documentación / RUTA / VTV</option>
                <option value="seguro">Seguro</option>
                <option value="neumáticos">Neumáticos</option>
                <option value="combustible">Combustible</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título del Recordatorio <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Renovación oblea RUTA y matafuego reglamentario"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fecha Límite</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kilometraje Límite
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ej: 100000"
                value={dueMileage || ''}
                onChange={(e) =>
                  setDueMileage(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold"
              >
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🟢 Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notas Adicionales</label>
            <textarea
              rows={2}
              placeholder="Instrucciones, turnos reservados o datos complementarios..."
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
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Recordatorio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
