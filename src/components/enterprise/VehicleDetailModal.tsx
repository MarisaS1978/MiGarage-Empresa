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
  ChevronRight,
  Phone,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { VehicleFormModal } from '../common/VehicleFormModal';
import { QuickAssignDriverModal } from '../common/QuickAssignDriverModal';
import { DriverDetailModal } from './DriverDetailModal';

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
    openShareInsurance,
    isOwner,
  } = useGarage();

  const [activeTab, setActiveTab] = useState<
    'mantenimiento' | 'gastos' | 'combustible' | 'documentos' | 'seguro' | 'siniestros' | 'recordatorios' | 'chofer'
  >('mantenimiento');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDriverDetailModal, setShowDriverDetailModal] = useState(false);

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

  // Totals & Statistics
  const totalSpent = vehExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFuelLiters = vehFuel.reduce((sum, f) => sum + f.liters, 0);
  const totalMaintenanceCost = vehMaintenance.reduce((sum, m) => sum + m.cost, 0);
  const preventiveServicesCount = vehMaintenance.filter((m) => m.isPreventive).length;
  const correctiveServicesCount = vehMaintenance.length - preventiveServicesCount;

  // Last and Next estimated service
  const sortedMaintenance = [...vehMaintenance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastMaintenance = sortedMaintenance[0];

  // Estimated next service: vehicle mileage rounded to next 10,000 km or reminder
  const nextMaintenanceReminder = vehReminders.find(
    (r) => r.category === 'mantenimiento' || r.title.toLowerCase().includes('service')
  );
  const estimatedNextMileage = nextMaintenanceReminder?.dueMileage || Math.ceil((vehicle.currentMileage + 1) / 10000) * 10000;

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

  // Driver license expiration calculations if assigned
  let driverExpStatus = null;
  if (assignedDriver) {
    const today = new Date('2026-10-08');
    const expDate = new Date(assignedDriver.licenseExpiry);
    const daysLeft = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    driverExpStatus = {
      daysLeft,
      isExpired: daysLeft <= 0,
      isExpiringSoon: daysLeft > 0 && daysLeft <= 30,
    };
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
        <div className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94vh] sm:max-h-[90vh] flex flex-col my-auto">
          {/* Header Cover Bar - Compact & Responsive */}
          <div className="bg-[#172554] text-white p-4 sm:p-5 relative shrink-0">
            {/* Top Close & Main Action Buttons */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 sm:gap-2 z-10">
              {isOwner && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition"
                    title="Editar datos del vehículo"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-1.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-600/40 cursor-pointer transition"
                    title="Eliminar unidad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => openShareInsurance(vehicle.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 hover:text-white text-xs font-semibold cursor-pointer transition border border-blue-400/40 shadow-xs"
                title="Compartir datos de seguro y auxilio mecánico en siniestro"
              >
                <Shield className="w-3.5 h-3.5 text-blue-300" />
                <span className="hidden sm:inline">Compartir Seguro</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Cerrar ficha"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Vehicle Main Info Row */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 pr-20 sm:pr-24">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border-2 border-blue-400/30 shadow-md">
                {vehicle.photoUrl ? (
                  <img
                    src={vehicle.photoUrl}
                    alt={vehicle.model}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Truck className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-black/40 border border-white/20 text-[#DBEAFE] tracking-wider">
                    {vehicle.plate}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
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
                      ? '🟡 En mantenimiento'
                      : '🔴 Fuera de servicio'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-blue-200 hidden sm:inline">
                    {vehicle.year} · {vehicle.color} · {vehicle.fuelType.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight truncate text-white leading-tight">
                  {vehicle.brand} {vehicle.model}{' '}
                  {vehicle.version && (
                    <span className="text-xs sm:text-sm text-blue-200 font-normal">({vehicle.version})</span>
                  )}
                </h2>

                {/* Sub-bar: Mileage, Cost Center & Compact Driver Indicator */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs text-blue-100">
                  <div className="flex items-center gap-1.5 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                    <Gauge className="w-3.5 h-3.5 text-[#DBEAFE]" />
                    <span>{vehicle.currentMileage.toLocaleString('es-AR')} km</span>
                  </div>

                  {vehicle.costCenter && (
                    <span className="bg-blue-900/60 border border-blue-400/20 px-2 py-0.5 rounded-md font-medium text-[11px] sm:text-xs text-blue-200">
                      🏢 {vehicle.costCenter}
                    </span>
                  )}

                  {/* Compact Driver Tag - Replaces the huge banner taking up half the screen */}
                  <div className="flex items-center gap-1.5 bg-blue-950/70 border border-blue-400/30 px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs">
                    <User className="w-3 h-3 text-[#DBEAFE] shrink-0" />
                    <span className="text-blue-300">Chofer:</span>
                    {assignedDriver ? (
                      <span className="font-bold text-white max-w-[120px] sm:max-w-none truncate">
                        {assignedDriver.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Sin asignar</span>
                    )}

                    {assignedDriver ? (
                      <button
                        onClick={() => setShowDriverDetailModal(true)}
                        className="text-blue-300 hover:text-white underline font-semibold text-[10px] ml-1 cursor-pointer"
                        title="Ver ficha completa del chofer"
                      >
                        Ficha
                      </button>
                    ) : null}

                    {isOwner && (
                      <button
                        onClick={() => setShowAssignModal(true)}
                        className="text-[10px] bg-[#2563EB] hover:bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold cursor-pointer transition ml-1"
                      >
                        {assignedDriver ? 'Cambiar' : 'Asignar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Selector Bar */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto mt-3.5 pt-2.5 border-t border-white/10 scrollbar-none text-xs font-semibold">
              {[
                { id: 'mantenimiento', label: `Mantenimiento (${vehMaintenance.length})`, icon: Wrench },
                { id: 'gastos', label: `Gastos (${vehExpenses.length})`, icon: Coins },
                { id: 'combustible', label: `Combustible (${vehFuel.length})`, icon: Fuel },
                { id: 'documentos', label: `Documentos (${vehDocs.length})`, icon: FileText },
                { id: 'seguro', label: 'Seguro', icon: Shield },
                { id: 'siniestros', label: `Siniestros (${vehIncidents.length})`, icon: AlertTriangle },
                { id: 'recordatorios', label: `Recordatorios (${vehReminders.length})`, icon: Bell },
                { id: 'chofer', label: assignedDriver ? `Chofer (${assignedDriver.name.split(' ')[0]})` : 'Chofer', icon: User },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 text-xs ${
                      isActive
                        ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                        : 'text-blue-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Body - Maximized height for maintenance & details */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 md:p-6 bg-[#F3F6FA] space-y-4">
            {/* TAB: MANTENIMIENTO */}
            {activeTab === 'mantenimiento' && (
              <div className="space-y-3.5">
                {/* Maintenance Dashboard Overview Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-[#2563EB]" />
                        <h3 className="font-extrabold text-[#172554] text-sm sm:text-base">
                          Historial y Control de Mantenimiento
                        </h3>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Intervenciones preventivas, correctivas y plan de servicios para la unidad {vehicle.plate}.
                      </p>
                    </div>

                    {onOpenQuickAction && (
                      <button
                        onClick={() => onOpenQuickAction('mantenimiento')}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs transition shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Registrar Service</span>
                      </button>
                    )}
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3">
                    <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Intervenciones
                      </span>
                      <div className="font-extrabold text-slate-900 text-base mt-0.5">
                        {vehMaintenance.length}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          ({preventiveServicesCount} prev. / {correctiveServicesCount} corr.)
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Inversión Total
                      </span>
                      <div className="font-extrabold font-mono text-[#172554] text-base mt-0.5">
                        ${totalMaintenanceCost.toLocaleString('es-AR')}
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Último Service
                      </span>
                      <div className="font-bold text-slate-800 text-xs mt-0.5 truncate">
                        {lastMaintenance ? (
                          <>
                            <span>{lastMaintenance.date}</span>
                            <span className="text-[11px] text-slate-500 block font-mono">
                              {lastMaintenance.mileage.toLocaleString('es-AR')} km
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-normal">Sin historial</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Próximo Service Sug.
                      </span>
                      <div className="font-bold text-blue-700 text-xs mt-0.5">
                        <span className="font-mono">{estimatedNextMileage.toLocaleString('es-AR')} km</span>
                        <span className="text-[11px] text-blue-500 block">
                          (en {(Math.max(0, estimatedNextMileage - vehicle.currentMileage)).toLocaleString('es-AR')} km)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Records List */}
                <div className="space-y-2.5">
                  {vehMaintenance.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-[#DCE3ED]">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center mb-3">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        No hay mantenimientos registrados aún
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                        Registrá el primer service o reparación para llevar un control estricto de kilometrajes, costos y talleres.
                      </p>
                      {onOpenQuickAction && (
                        <button
                          onClick={() => onOpenQuickAction('mantenimiento')}
                          className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Registrar Primer Service</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    sortedMaintenance.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCE3ED] hover:border-blue-300 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-[#172554] text-xs uppercase tracking-wide">
                              {m.type}
                            </span>
                            <span className="text-[11px] text-[#64748B] font-mono bg-slate-100 px-2 py-0.5 rounded">
                              📅 {m.date}
                            </span>
                            <span className="text-[11px] text-blue-900 font-mono font-bold bg-[#DBEAFE] px-2 py-0.5 rounded">
                              🏎️ {m.mileage.toLocaleString('es-AR')} km
                            </span>
                            {m.isPreventive ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                Preventivo
                              </span>
                            ) : (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                Correctivo
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {m.description}
                          </p>

                          <div className="text-[11px] text-[#64748B] flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
                            <span>
                              Taller: <strong className="text-slate-700">{m.workshop}</strong>
                            </span>
                            {m.invoiceNumber && (
                              <span className="font-mono">Factura: {m.invoiceNumber}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                          <span className="font-mono font-black text-base text-[#172554]">
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
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition hover:bg-rose-50"
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
              </div>
            )}

            {/* TAB: CHOFER (Dedicated driver view that doesn't push maintenance away) */}
            {activeTab === 'chofer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#172554] text-sm sm:text-base">
                      Chofer Asignado a esta Unidad
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Detalle del conductor responsable de la unidad {vehicle.plate}.
                    </p>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{assignedDriver ? 'Cambiar Chofer' : 'Asignar Chofer'}</span>
                    </button>
                  )}
                </div>

                {assignedDriver ? (
                  <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-[#DBEAFE] text-[#172554] font-black text-xl flex items-center justify-center shrink-0 border border-blue-300">
                          {assignedDriver.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-[#172554]">
                              {assignedDriver.name}
                            </h4>
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
                          <div className="text-xs text-[#64748B] flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            <span>DNI: {assignedDriver.dni}</span>
                            {assignedDriver.phone && <span>Tel: {assignedDriver.phone}</span>}
                            {assignedDriver.email && <span>Email: {assignedDriver.email}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setShowDriverDetailModal(true)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-semibold cursor-pointer transition flex items-center gap-1"
                        >
                          <span>Ficha Completa</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => assignDriverToVehicle(vehicle.id, null)}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold cursor-pointer transition border border-amber-200"
                          >
                            Desasignar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Licencia de Conducir
                        </span>
                        <div className="font-mono font-bold text-slate-900 mt-1">
                          {assignedDriver.licenseNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Categoría: {assignedDriver.licenseCategory}
                        </div>
                      </div>

                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Vencimiento de Licencia
                        </span>
                        <div className="font-mono font-bold text-slate-900 mt-1">
                          {assignedDriver.licenseExpiry}
                        </div>
                        {driverExpStatus && (
                          <div className="mt-1">
                            {driverExpStatus.isExpired ? (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                                ⚠️ Licencia Vencida
                              </span>
                            ) : driverExpStatus.isExpiringSoon ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
                                ⏳ Vence en {driverExpStatus.daysLeft} días
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                                ✓ Vigente ({driverExpStatus.daysLeft} días)
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Canal de Contacto
                        </span>
                        <div className="font-bold text-slate-900 mt-1 truncate">
                          {assignedDriver.phone || 'Sin teléfono'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {assignedDriver.email || 'Sin correo registrado'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-2xl border border-dashed border-[#DCE3ED] text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Unidad sin chofer asignado
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Esta unidad se encuentra disponible en la flota y no tiene ningún conductor vinculado actualmente.
                      </p>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => setShowAssignModal(true)}
                        className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer transition shadow-xs inline-flex items-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Asignar Chofer a {vehicle.plate}</span>
                      </button>
                    )}
                  </div>
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
                  {onOpenQuickAction && (
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
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#172554] text-sm">Póliza Corporativa de Seguro</h3>
                  <button
                    onClick={() => openShareInsurance(vehicle.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Compartir en Siniestro</span>
                  </button>
                </div>

                {vehInsurance ? (
                  <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs space-y-4 text-xs">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                      <button
                        onClick={() => openShareInsurance(vehicle.id)}
                        className="px-4 py-2 rounded-xl bg-[#172554] hover:bg-blue-950 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Shield className="w-3.5 h-3.5 text-blue-300" />
                        <span>Abrir Ficha de Seguro para Siniestro</span>
                      </button>
                      <a
                        href={`tel:${vehInsurance.assistancePhone}`}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition flex items-center gap-1.5 border border-emerald-200"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Llamar Auxilio ({vehInsurance.assistancePhone})</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 bg-white rounded-2xl border border-[#DCE3ED] space-y-2">
                    <p>No hay póliza de seguro asignada a esta unidad.</p>
                    <button
                      onClick={() => openShareInsurance(vehicle.id)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition cursor-pointer"
                    >
                      Generar Constancia Digital de Flota
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SINIESTROS */}
            {activeTab === 'siniestros' && (
              <div className="space-y-3.5">
                {/* Fast Insurance Share Banner in Incident Tab */}
                <div className="p-3.5 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">¿Ocurrió un siniestro con esta unidad?</span>
                      <span className="text-slate-600 text-[11px]">Compartí la constancia del seguro y auxilio mecánico con el tercero o peritaje.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openShareInsurance(vehicle.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#172554] hover:bg-blue-950 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-300" />
                    <span>Compartir Seguro 🛡️</span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#172554] text-sm">Historial de Siniestros</h3>
                  {onOpenQuickAction && (
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

      {showDriverDetailModal && assignedDriver && (
        <DriverDetailModal
          driverId={assignedDriver.id}
          onClose={() => setShowDriverDetailModal(false)}
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
