import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Truck,
  X,
  Wrench,
  Bell,
  Shield,
  FileText,
  Coins,
  Fuel,
  AlertTriangle,
  User,
  Calendar,
  Gauge,
  Plus,
  Trash2,
  Edit,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { VehicleFormModal } from '../common/VehicleFormModal';
import { QuickAssignDriverModal } from '../common/QuickAssignDriverModal';

interface VehicleDetailModalProps {
  vehicleId: string;
  onClose: () => void;
  onOpenQuickAction?: (
    actionType: 'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro'
  ) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicleId,
  onClose,
  onOpenQuickAction,
}) => {
  const {
    vehicles,
    drivers,
    maintenance,
    reminders,
    insurance,
    documents,
    expenses,
    fuelLogs,
    incidents,
    deleteVehicle,
    deleteMaintenanceRecord,
    deleteExpense,
    deleteFuelLog,
    deleteDocument,
    deleteInsurancePolicy,
    deleteReminder,
    deleteIncident,
    assignDriverToVehicle,
    checkVehicleRelations,
    isOwner,
  } = useGarage();

  const [activeTab, setActiveTab] = useState<
    'mantenimiento' | 'gastos' | 'combustible' | 'documentos' | 'seguro' | 'siniestros' | 'recordatorios'
  >('mantenimiento');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Generic delete modal for sub-items
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'mantenimiento' | 'gasto' | 'combustible' | 'documento' | 'seguro' | 'recordatorio' | 'siniestro';
    id: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return null;

  // Filter records specifically for this vehicle
  const assignedDriver = drivers.find((d) => d.id === vehicle.assignedDriverId);
  const vehMaintenance = maintenance.filter((m) => m.vehicleId === vehicle.id);
  const vehReminders = reminders.filter((r) => r.vehicleId === vehicle.id);
  const vehInsurance = insurance.find((i) => i.vehicleId === vehicle.id);
  const vehDocs = documents.filter((d) => d.vehicleId === vehicle.id);
  const vehExpenses = expenses.filter((e) => e.vehicleId === vehicle.id);
  const vehFuel = fuelLogs.filter((f) => f.vehicleId === vehicle.id);
  const vehIncidents = incidents.filter((i) => i.vehicleId === vehicle.id);

  // Totals
  const totalSpent = vehExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFuelLiters = vehFuel.reduce((sum, f) => sum + f.liters, 0);

  const relations = checkVehicleRelations(vehicle.id);

  const handleDeleteVehicleConfirm = () => {
    deleteVehicle(vehicle.id);
    setShowDeleteModal(false);
    onClose();
  };

  const handleSubItemDeleteConfirm = () => {
    if (!itemToDelete) return;
    switch (itemToDelete.type) {
      case 'mantenimiento':
        deleteMaintenanceRecord(itemToDelete.id);
        break;
      case 'gasto':
        deleteExpense(itemToDelete.id);
        break;
      case 'combustible':
        deleteFuelLog(itemToDelete.id);
        break;
      case 'documento':
        deleteDocument(itemToDelete.id);
        break;
      case 'seguro':
        deleteInsurancePolicy(itemToDelete.id);
        break;
      case 'recordatorio':
        deleteReminder(itemToDelete.id);
        break;
      case 'siniestro':
        deleteIncident(itemToDelete.id);
        break;
    }
    setItemToDelete(null);
  };

  const warningList: string[] = [];
  if (relations.assignedDriverName) {
    warningList.push(`Chofer asignado: ${relations.assignedDriverName}. Se desasignará automáticamente.`);
  }
  if (relations.maintenanceCount > 0) {
    warningList.push(`${relations.maintenanceCount} registro(s) de mantenimiento asociados.`);
  }
  if (relations.expensesCount > 0 || relations.fuelLogsCount > 0) {
    warningList.push(
      `${relations.expensesCount} gasto(s) y ${relations.fuelLogsCount} carga(s) de combustible registradas.`
    );
  }
  if (relations.documentsCount > 0 || relations.insuranceCount > 0) {
    warningList.push(`${relations.documentsCount} documento(s) y pólizas corporativas vinculadas.`);
  }
  if (relations.incidentsCount > 0) {
    warningList.push(`${relations.incidentsCount} siniestro(s) registrados en el historial.`);
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
        <div className="relative bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col my-4">
          {/* Header Cover Bar */}
          <div className="bg-[#172554] text-white p-5 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border-2 border-blue-400/30">
                {vehicle.photoUrl ? (
                  <img
                    src={vehicle.photoUrl}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Truck className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-black/40 border border-white/20 text-[#DBEAFE]">
                    {vehicle.plate}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      vehicle.fleetStatus === 'disponible'
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                        : vehicle.fleetStatus === 'en_uso'
                        ? 'bg-blue-900/60 text-blue-300 border border-blue-500/40'
                        : vehicle.fleetStatus === 'mantenimiento'
                        ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-900/60 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {vehicle.fleetStatus === 'disponible'
                      ? '🟢 Disponible'
                      : vehicle.fleetStatus === 'en_uso'
                      ? '🔵 En uso'
                      : vehicle.fleetStatus === 'mantenimiento'
                      ? '🟡 Mantenimiento'
                      : '🔴 Fuera de servicio'}
                  </span>
                  <span className="text-xs text-blue-200">
                    {vehicle.year} · {vehicle.color} · {vehicle.fuelType.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate text-white">
                  {vehicle.brand} {vehicle.model}{' '}
                  {vehicle.version && (
                    <span className="text-base text-blue-200 font-normal">({vehicle.version})</span>
                  )}
                </h2>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-blue-100">
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <Gauge className="w-4 h-4 text-[#DBEAFE]" />
                    <span>{vehicle.currentMileage.toLocaleString('es-AR')} km</span>
                  </div>
                  {vehicle.costCenter && (
                    <span className="bg-blue-800/60 px-2 py-0.5 rounded font-semibold text-blue-100">
                      🏢 {vehicle.costCenter}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-200">Chofer asignado:</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white">
                  {vehicle.assignedDriverName || 'Sin asignar'}
                </span>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer flex items-center gap-1 transition"
                  title="Asignar o cambiar chofer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{vehicle.assignedDriverId ? 'Cambiar' : 'Asignar'}</span>
                </button>
                {vehicle.assignedDriverId && (
                  <button
                    onClick={() => assignDriverToVehicle(vehicle.id, null)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold cursor-pointer flex items-center gap-1 transition border border-amber-500/30"
                    title="Desasignar chofer de esta unidad"
                  >
                    <span>Desasignar</span>
                  </button>
                )}
              </div>

              {isOwner && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar Vehículo</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-600/40 cursor-pointer transition"
                    title="Eliminar unidad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Tabs Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto mt-4 pt-2 border-t border-white/10 scrollbar-none text-xs font-semibold">
              {[
                { id: 'mantenimiento', label: `Mantenimiento (${vehMaintenance.length})`, icon: Wrench },
                { id: 'gastos', label: `Gastos (${vehExpenses.length})`, icon: Coins },
                { id: 'combustible', label: `Combustible (${vehFuel.length})`, icon: Fuel },
                { id: 'documentos', label: `Documentos (${vehDocs.length})`, icon: FileText },
                { id: 'seguro', label: 'Seguro', icon: Shield },
                { id: 'siniestros', label: `Siniestros (${vehIncidents.length})`, icon: AlertTriangle },
                { id: 'recordatorios', label: `Recordatorios (${vehReminders.length})`, icon: Bell },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                        : 'text-blue-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#F3F6FA] space-y-4">
            {/* Persistent Driver Banner */}
            {assignedDriver ? (
              <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-linear-to-r from-blue-50/60 to-white">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#172554] font-bold flex items-center justify-center shrink-0 text-sm">
                    {assignedDriver.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[#64748B]">Conductor asignado:</span>
                      <strong className="text-sm font-bold text-[#172554] truncate">{assignedDriver.name}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          assignedDriver.status === 'activo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {assignedDriver.status === 'activo' ? 'Activo' : 'En licencia'}
                      </span>
                    </div>
                    <div className="text-xs text-[#64748B] flex flex-wrap gap-x-3 gap-y-1 mt-0.5 font-mono">
                      <span>DNI: {assignedDriver.dni}</span>
                      <span>Licencia: {assignedDriver.licenseNumber} (Vence {assignedDriver.licenseExpiry})</span>
                      {assignedDriver.phone && <span>Tel: {assignedDriver.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#DBEAFE] hover:bg-blue-100 text-[#2563EB] text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Cambiar</span>
                  </button>
                  <button
                    onClick={() => assignDriverToVehicle(vehicle.id, null)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold cursor-pointer transition border border-amber-200"
                  >
                    Desasignar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-3.5 rounded-2xl border border-dashed border-[#DCE3ED] flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Esta unidad no tiene chofer asignado actualmente.</span>
                </div>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold cursor-pointer transition flex items-center gap-1 shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Asignar Chofer</span>
                </button>
              </div>
            )}
            {/* TAB: MANTENIMIENTO */}
            {activeTab === 'mantenimiento' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#172554] text-sm">Historial de Mantenimiento</h3>
                    <p className="text-xs text-[#64748B]">Intervenciones, services y reparaciones.</p>
                  </div>
                  {isOwner && onOpenQuickAction && (
                    <button
                      onClick={() => onOpenQuickAction('mantenimiento')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Service</span>
                    </button>
                  )}
                </div>

                {vehMaintenance.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED]">
                    No hay intervenciones registradas para este vehículo.
                  </div>
                ) : (
                  vehMaintenance.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1E293B] text-xs uppercase tracking-wide">
                            {m.type}
                          </span>
                          <span className="text-[11px] text-[#64748B] font-mono">
                            {m.date} · {m.mileage.toLocaleString('es-AR')} km
                          </span>
                          {m.isPreventive && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                              Preventivo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1E293B]">{m.description}</p>
                        <div className="text-[11px] text-[#64748B]">
                          Taller: <strong>{m.workshop}</strong>
                          {m.invoiceNumber && ` · Factura: ${m.invoiceNumber}`}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="font-mono font-black text-sm text-[#172554]">
                          ${m.cost.toLocaleString('es-AR')}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() =>
                              setItemToDelete({
                                type: 'mantenimiento',
                                id: m.id,
                                title: `Mantenimiento ${m.type.toUpperCase()}`,
                                subtitle: `${m.date} — $${m.cost.toLocaleString('es-AR')}`,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: GASTOS */}
            {activeTab === 'gastos' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#172554] text-sm">Gastos Operativos</h3>
                    <p className="text-xs text-[#64748B]">
                      Total acumulado: <strong className="text-slate-900">${totalSpent.toLocaleString('es-AR')}</strong>
                    </p>
                  </div>
                  {isOwner && onOpenQuickAction && (
                    <button
                      onClick={() => onOpenQuickAction('combustible')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nuevo Gasto</span>
                    </button>
                  )}
                </div>

                {vehExpenses.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED]">
                    No hay gastos registrados para este vehículo.
                  </div>
                ) : (
                  vehExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#DCE3ED] shadow-xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 capitalize">{exp.category}</span>
                          <span className="text-[#64748B] font-mono text-[11px]">{exp.date}</span>
                        </div>
                        <div className="text-slate-700 mt-0.5">{exp.description}</div>
                        {exp.vendor && <div className="text-[11px] text-[#64748B]">Proveedor: {exp.vendor}</div>}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          ${exp.amount.toLocaleString('es-AR')}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() =>
                              setItemToDelete({
                                type: 'gasto',
                                id: exp.id,
                                title: `Gasto de ${exp.category}`,
                                subtitle: `${exp.date} — $${exp.amount.toLocaleString('es-AR')}`,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: COMBUSTIBLE */}
            {activeTab === 'combustible' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#172554] text-sm">Cargas de Combustible</h3>
                    <p className="text-xs text-[#64748B]">
                      Litros totales cargados: <strong className="text-slate-900">{totalFuelLiters} L</strong>
                    </p>
                  </div>
                  {isOwner && onOpenQuickAction && (
                    <button
                      onClick={() => onOpenQuickAction('combustible')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Carga</span>
                    </button>
                  )}
                </div>

                {vehFuel.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED]">
                    No hay cargas registradas para este vehículo.
                  </div>
                ) : (
                  vehFuel.map((fl) => (
                    <div
                      key={fl.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#DCE3ED] shadow-xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{fl.station}</span>
                          <span className="text-[#64748B] font-mono text-[11px]">{fl.date}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                            {fl.fuelType}
                          </span>
                        </div>
                        <div className="text-slate-600 mt-0.5">
                          {fl.liters} L · Odómetro: {fl.mileage.toLocaleString('es-AR')} km · ($
                          {fl.pricePerLiter.toFixed(0)}/L)
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          ${fl.totalPrice.toLocaleString('es-AR')}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() =>
                              setItemToDelete({
                                type: 'combustible',
                                id: fl.id,
                                title: `Carga de ${fl.liters} L en ${fl.station}`,
                                subtitle: `${fl.date} — $${fl.totalPrice.toLocaleString('es-AR')}`,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: DOCUMENTOS */}
            {activeTab === 'documentos' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#172554] text-sm">Documentación & R.U.T.A.</h3>
                </div>

                {vehDocs.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED]">
                    No hay documentos cargados para este vehículo.
                  </div>
                ) : (
                  vehDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#DCE3ED] shadow-xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{doc.title}</div>
                          <div className="text-[11px] text-[#64748B]">
                            {doc.expiryDate ? `Vence: ${doc.expiryDate}` : 'Sin vencimiento'} · {doc.type}
                          </div>
                        </div>
                      </div>

                      {isOwner && (
                        <button
                          onClick={() =>
                            setItemToDelete({
                              type: 'documento',
                              id: doc.id,
                              title: doc.title,
                              subtitle: doc.expiryDate ? `Vencimiento: ${doc.expiryDate}` : undefined,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: SEGURO */}
            {activeTab === 'seguro' && (
              <div className="space-y-3">
                <h3 className="font-bold text-[#172554] text-sm">Póliza Corporativa de Seguro</h3>
                {vehInsurance ? (
                  <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <div className="font-extrabold text-[#172554] text-base">
                          {vehInsurance.company}
                        </div>
                        <div className="text-[11px] text-[#64748B] font-mono">
                          Póliza N° {vehInsurance.policyNumber}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        Vigente
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[#64748B]">Cobertura:</span>
                        <div className="font-semibold text-slate-900 mt-0.5">
                          {vehInsurance.coverageType}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#64748B]">Vencimiento de Póliza:</span>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">
                          {vehInsurance.expiryDate}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#64748B]">Teléfono Auxilio 24h:</span>
                        <div className="font-bold text-blue-700 mt-0.5">
                          {vehInsurance.assistancePhone}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#64748B]">Cuota Mensual:</span>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">
                          ${vehInsurance.monthlyPremium?.toLocaleString('es-AR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED]">
                    No hay póliza de seguro asignada a esta unidad.
                  </div>
                )}
              </div>
            )}

            {/* TAB: SINIESTROS */}
            {activeTab === 'siniestros' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#172554] text-sm">Historial de Siniestros</h3>
                  {isOwner && onOpenQuickAction && (
                    <button
                      onClick={() => onOpenQuickAction('siniestro')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Siniestro</span>
                    </button>
                  )}
                </div>

                {vehIncidents.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED]">
                    No se registran siniestros ni incidentes para esta unidad.
                  </div>
                ) : (
                  vehIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900">
                          {inc.type.toUpperCase()} · {inc.date} {inc.time}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[10px]">
                          {inc.status}
                        </span>
                      </div>
                      <p className="text-slate-700">{inc.description}</p>
                      <div className="text-[11px] text-[#64748B]">
                        Lugar: {inc.location} · Chofer: <strong>{inc.driverName || 'Sin asignar'}</strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: RECORDATORIOS */}
            {activeTab === 'recordatorios' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#172554] text-sm">Recordatorios y Alertas</h3>
                </div>

                {vehReminders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED]">
                    No hay recordatorios pendientes para esta unidad.
                  </div>
                ) : (
                  vehReminders.map((rem) => (
                    <div
                      key={rem.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#DCE3ED] shadow-xs flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{rem.title}</div>
                        <div className="text-[11px] text-[#64748B]">
                          {rem.dueDate ? `Fecha: ${rem.dueDate}` : ''}
                          {rem.dueMileage ? ` · Km: ${rem.dueMileage.toLocaleString('es-AR')}` : ''}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {rem.priority}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <VehicleFormModal
          vehicleToEdit={vehicle}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showAssignModal && (
        <QuickAssignDriverModal
          vehicle={vehicle}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteVehicleConfirm}
          title="¿Estás seguro de que querés eliminar este vehículo?"
          itemName={`${vehicle.brand} ${vehicle.model}`}
          itemSubtitle={`Patente: ${vehicle.plate} · Año: ${vehicle.year} · ${vehicle.costCenter || 'Flota'}`}
          warningDetails={warningList}
        />
      )}

      {itemToDelete && (
        <ConfirmDeleteModal
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleSubItemDeleteConfirm}
          title={`¿Eliminar ${itemToDelete.title}?`}
          itemName={itemToDelete.title}
          itemSubtitle={itemToDelete.subtitle}
        />
      )}
    </>
  );
};
