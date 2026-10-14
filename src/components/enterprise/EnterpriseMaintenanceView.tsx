import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { MaintenanceRecord } from '../../types';
import {
  Wrench,
  Plus,
  Clock,
  Gauge,
  Calendar,
  DollarSign,
  User,
  Trash2,
  Edit,
  CheckCircle2,
  Filter,
  Search,
} from 'lucide-react';
import { MaintenanceFormModal } from './MaintenanceFormModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface EnterpriseMaintenanceProps {
  onOpenQuickAction?: (actionType: 'mantenimiento') => void;
}

export const EnterpriseMaintenanceView: React.FC<EnterpriseMaintenanceProps> = () => {
  const { maintenance, vehicles, deleteMaintenanceRecord, isOwner } = useGarage();
  const [filterType, setFilterType] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<MaintenanceRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<MaintenanceRecord | null>(null);

  const filtered = maintenance.filter((m) => {
    const matchesFilter =
      filterType === 'todos'
        ? true
        : filterType === 'preventivo'
        ? m.isPreventive
        : !m.isPreventive;

    const matchesSearch =
      m.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.workshop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalDowntime = maintenance.reduce((sum, m) => sum + (m.downtimeHours || 0), 0);
  const totalCost = maintenance.reduce((sum, m) => sum + m.cost, 0);

  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      deleteMaintenanceRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Mantenimiento de Flota
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Gestión técnica de intervenciones preventivas, correctivas, costos de mano de obra y horas de parada.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Intervención Técnica</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Costo Total Mantenimiento</div>
          <div className="text-2xl font-bold text-[#172554] font-mono mt-1">
            ${totalCost.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Repuestos + Mano de obra</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Horas Fuera de Servicio</div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1">
            {totalDowntime} hs
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Tiempo de parada acumulado</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Ratio Preventivo / Total</div>
          <div className="text-2xl font-bold text-[#15803D] font-mono mt-1">
            {Math.round(
              (maintenance.filter((m) => m.isPreventive).length / Math.max(1, maintenance.length)) * 100
            )}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Meta corporativa: &gt; 70%</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            (document.activeElement as HTMLElement)?.blur();
          }}
          className="relative flex-1 w-full"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            enterKeyHint="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Buscar por vehículo, tipo, taller o descripción..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
        </form>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {['todos', 'preventivo', 'correctivo'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setFilterType(t);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                filterType === t
                  ? 'bg-[#172554] text-white'
                  : 'bg-white text-slate-600 border border-[#DCE3ED] hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List of Maintenance Records */}
      <div className="space-y-3.5">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl p-5 border border-[#DCE3ED] hover:border-[#2563EB]/40 transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs px-2.5 py-0.5 rounded bg-[#DBEAFE] text-[#172554] uppercase tracking-wide">
                  {m.type}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {m.vehicleName}
                </span>
                <span className="text-xs text-[#64748B] font-mono">
                  {m.date} · {m.mileage.toLocaleString('es-AR')} km
                </span>
                {m.isPreventive ? (
                  <span className="text-[10px] bg-emerald-100 text-[#15803D] px-2 py-0.5 rounded-full font-bold">
                    Preventivo
                  </span>
                ) : (
                  <span className="text-[10px] bg-rose-100 text-[#B91C1C] px-2 py-0.5 rounded-full font-bold">
                    Correctivo
                  </span>
                )}
              </div>

              <p className="text-xs text-[#1E293B] leading-relaxed">{m.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#64748B]">
                <span>
                  Taller: <strong className="text-slate-800">{m.workshop}</strong>
                </span>
                {m.invoiceNumber && <span>Factura: {m.invoiceNumber}</span>}
                {m.downtimeHours ? <span>Parada: {m.downtimeHours} hs</span> : null}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 self-stretch md:self-center pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
              <div className="text-right">
                <div className="font-mono font-extrabold text-base text-[#172554]">
                  ${m.cost.toLocaleString('es-AR')}
                </div>
                {m.laborCost ? (
                  <div className="text-[10px] text-[#64748B]">
                    MO: ${m.laborCost.toLocaleString('es-AR')}
                  </div>
                ) : null}
              </div>

              {isOwner && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRecordToEdit(m)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                    title="Editar intervención"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRecordToDelete(m)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                    title="Eliminar intervención"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#DCE3ED] text-xs text-slate-500">
            No se encontraron registros de mantenimiento con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Add / Edit Modals */}
      {showAddModal && (
        <MaintenanceFormModal onClose={() => setShowAddModal(false)} />
      )}

      {recordToEdit && (
        <MaintenanceFormModal
          recordToEdit={recordToEdit}
          onClose={() => setRecordToEdit(null)}
        />
      )}

      {/* Delete Confirmation */}
      {recordToDelete && (
        <ConfirmDeleteModal
          isOpen={!!recordToDelete}
          onClose={() => setRecordToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar intervención de mantenimiento?"
          itemName={`${recordToDelete.type.toUpperCase()} — ${recordToDelete.vehicleName}`}
          itemSubtitle={`Fecha: ${recordToDelete.date} · Costo: $${recordToDelete.cost.toLocaleString('es-AR')}`}
        />
      )}
    </div>
  );
};
