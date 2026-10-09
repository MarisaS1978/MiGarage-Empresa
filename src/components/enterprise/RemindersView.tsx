import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Reminder } from '../../types';
import {
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Gauge,
  Trash2,
  Edit,
  Search,
} from 'lucide-react';
import { ReminderModal } from './ReminderModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const RemindersView: React.FC = () => {
  const {
    reminders,
    toggleReminderComplete,
    snoozeReminder,
    deleteReminder,
    isOwner,
  } = useGarage();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);

  const filtered = reminders.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (reminderToDelete) {
      deleteReminder(reminderToDelete.id);
      setReminderToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Recordatorios Preventivos
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Control de alertas programadas por fecha y kilometraje para services y documentación.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Recordatorio</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por vehículo, título o categoría..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.map((rem) => (
          <div
            key={rem.id}
            className={`bg-white rounded-3xl p-5 border transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              rem.completed
                ? 'opacity-60 bg-slate-50 border-[#DCE3ED]'
                : 'border-[#DCE3ED] hover:border-[#2563EB]/40'
            }`}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {isOwner && (
                <button
                  onClick={() => toggleReminderComplete(rem.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition cursor-pointer ${
                    rem.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-[#2563EB] text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`font-bold text-xs ${
                      rem.completed ? 'line-through text-slate-500' : 'text-[#172554]'
                    }`}
                  >
                    {rem.title}
                  </span>
                  <span className="text-xs text-[#2563EB] font-mono font-bold">
                    {rem.vehicleName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rem.priority === 'alta'
                        ? 'bg-rose-100 text-rose-800'
                        : rem.priority === 'media'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {rem.priority}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                  {rem.dueDate && (
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rem.dueDate}</span>
                    </span>
                  )}
                  {rem.dueMileage && (
                    <span className="flex items-center gap-1 font-mono">
                      <Gauge className="w-3.5 h-3.5" />
                      <span>{rem.dueMileage.toLocaleString('es-AR')} km</span>
                    </span>
                  )}
                  <span className="capitalize">{rem.category}</span>
                </div>

                {rem.notes && <p className="text-[11px] text-slate-500">{rem.notes}</p>}
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {!rem.completed && (
                  <button
                    onClick={() => snoozeReminder(rem.id, 7, 1000)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer"
                  >
                    +7 días
                  </button>
                )}
                <button
                  onClick={() => setReminderToEdit(rem)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  title="Editar recordatorio"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReminderToDelete(rem)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  title="Eliminar recordatorio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#DCE3ED] text-xs text-slate-500">
            No se encontraron recordatorios registrados.
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ReminderModal onClose={() => setShowAddModal(false)} />
      )}
      {reminderToEdit && (
        <ReminderModal
          reminderToEdit={reminderToEdit}
          onClose={() => setReminderToEdit(null)}
        />
      )}
      {reminderToDelete && (
        <ConfirmDeleteModal
          isOpen={!!reminderToDelete}
          onClose={() => setReminderToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar recordatorio?"
          itemName={reminderToDelete.title}
          itemSubtitle={`Vehículo: ${reminderToDelete.vehicleName}`}
        />
      )}
    </div>
  );
};
