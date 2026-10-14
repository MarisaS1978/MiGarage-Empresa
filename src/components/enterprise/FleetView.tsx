import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { VehicleStatus, Vehicle } from '../../types';
import {
  Truck,
  Plus,
  Search,
  Filter,
  User,
  Gauge,
  Calendar,
  Building2,
  Trash2,
  ChevronRight,
  Shield,
  Clock,
  MoreVertical,
  Edit,
  UserCheck,
  Wrench,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { VehicleFormModal } from '../common/VehicleFormModal';
import { QuickAssignDriverModal } from '../common/QuickAssignDriverModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface FleetViewProps {
  onOpenVehicleModal: () => void;
  onSelectVehicle: (id: string) => void;
}

export const FleetView: React.FC<FleetViewProps> = ({
  onOpenVehicleModal,
  onSelectVehicle,
}) => {
  const {
    vehicles,
    drivers,
    updateFleetStatus,
    deleteVehicle,
    assignDriverToVehicle,
    checkVehicleRelations,
    openShareInsurance,
    isOwner,
  } = useGarage();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [activeMenuVehicleId, setActiveMenuVehicleId] = useState<string | null>(null);

  // Modals state
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [vehicleToAssign, setVehicleToAssign] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const filtered = vehicles.filter((v) => {
    const matchesSearch =
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.assignedDriverName &&
        v.assignedDriverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.costCenter && v.costCenter.toLowerCase().includes(searchTerm.toLowerCase()));

    const currentStatus = v.fleetStatus || 'disponible';
    const matchesStatus = statusFilter === 'todos' || currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: VehicleStatus) => {
    switch (status) {
      case 'disponible':
        return { label: '🟢 Disponible', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'en_uso':
        return { label: '🔵 En uso', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'mantenimiento':
        return { label: '🟡 Mantenimiento', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'fuera_de_servicio':
        return { label: '🔴 Fuera de servicio', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
      default:
        return { label: '🟢 Disponible', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    }
  };

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete.id);
      setVehicleToDelete(null);
    }
  };

  const relationsWarning = vehicleToDelete ? checkVehicleRelations(vehicleToDelete.id) : null;
  const deleteWarningDetails: string[] = [];
  if (relationsWarning) {
    if (relationsWarning.assignedDriverName) {
      deleteWarningDetails.push(
        `Tiene asignado al chofer ${relationsWarning.assignedDriverName}. Se desasignará automáticamente.`
      );
    }
    if (relationsWarning.maintenanceCount > 0) {
      deleteWarningDetails.push(`${relationsWarning.maintenanceCount} servicios de mantenimiento.`);
    }
    if (relationsWarning.expensesCount > 0 || relationsWarning.fuelLogsCount > 0) {
      deleteWarningDetails.push(
        `${relationsWarning.expensesCount} gastos y ${relationsWarning.fuelLogsCount} cargas de combustible.`
      );
    }
    if (relationsWarning.documentsCount > 0) {
      deleteWarningDetails.push(`${relationsWarning.documentsCount} documentos y pólizas asociadas.`);
    }
    if (relationsWarning.incidentsCount > 0) {
      deleteWarningDetails.push(`${relationsWarning.incidentsCount} siniestros registrados.`);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Flota Empresarial
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Administración completa de unidades de transporte, choferes asignados y centros de costo.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={onOpenVehicleModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Unidad a Flota</span>
          </button>
        )}
      </div>

      {/* Search and Status Filters */}
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
            placeholder="Buscar por patente, marca, chofer o centro de costo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'disponible', label: '🟢 Disponibles' },
            { id: 'en_uso', label: '🔵 En uso' },
            { id: 'mantenimiento', label: '🟡 Mantenimiento' },
            { id: 'fuera_de_servicio', label: '🔴 Fuera servicio' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setStatusFilter(st.id);
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#172554] text-white'
                  : 'bg-white text-slate-600 border border-[#DCE3ED] hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Cards */}
      <div className="space-y-3.5">
        {filtered.map((veh) => {
          const currentStatus = veh.fleetStatus || 'disponible';
          const badge = getStatusBadge(currentStatus);
          const isMenuOpen = activeMenuVehicleId === veh.id;

          return (
            <div
              key={veh.id}
              className="bg-white rounded-3xl p-3.5 sm:p-5 border border-[#DCE3ED] hover:border-[#2563EB]/50 transition shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 relative w-full min-w-0 max-w-full"
            >
              {/* Left Details */}
              <div
                onClick={() => onSelectVehicle(veh.id)}
                className="flex items-start sm:items-center gap-3 sm:gap-4 cursor-pointer flex-1 min-w-0 w-full"
              >
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {veh.photoUrl ? (
                    <img
                      src={veh.photoUrl}
                      alt={veh.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-mono text-[11px] sm:text-xs font-black px-2 py-0.5 rounded bg-[#172554] text-white tracking-wider shrink-0">
                      {veh.plate}
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#64748B] truncate max-w-[150px] sm:max-w-none">
                      {veh.year} · {veh.type} · {veh.color}
                    </span>
                    {veh.costCenter && (
                      <span className="text-[10px] sm:text-xs font-semibold text-blue-900 bg-[#DBEAFE] px-2 py-0.5 rounded border border-blue-200 truncate max-w-[130px] sm:max-w-[200px]">
                        🏢 {veh.costCenter}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#172554] truncate max-w-full">
                    {veh.brand} {veh.model}{' '}
                    {veh.version && (
                      <span className="text-xs text-[#64748B] font-normal">{veh.version}</span>
                    )}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-mono font-bold text-slate-800 shrink-0">
                      <Gauge className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{veh.currentMileage.toLocaleString('es-AR')} km</span>
                    </div>

                    <div className="flex items-center gap-1 min-w-0 max-w-full">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">
                        Chofer:{' '}
                        {veh.assignedDriverName ? (
                          <strong className="text-[#172554] font-semibold">
                            {veh.assignedDriverName}
                          </strong>
                        ) : (
                          <span className="text-slate-400 italic">Sin asignar</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Quick Status, Actions & 3-Dots Menu */}
              <div className="flex items-center justify-between gap-2 pt-2.5 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto min-w-0">
                {/* Status Switcher Select (Owner only) */}
                <div className="min-w-0 flex-1 sm:flex-initial">
                  {isOwner ? (
                    <select
                      value={currentStatus}
                      onChange={(e) => updateFleetStatus(veh.id, e.target.value as VehicleStatus)}
                      className={`w-full sm:w-auto text-xs font-bold py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl border cursor-pointer focus:outline-hidden truncate ${badge.bg}`}
                    >
                      <option value="disponible">🟢 Disponible</option>
                      <option value="en_uso">🔵 En uso</option>
                      <option value="mantenimiento">🟡 Mantenimiento</option>
                      <option value="fuera_de_servicio">🔴 Fuera servicio</option>
                    </select>
                  ) : (
                    <span className={`inline-block text-xs font-bold py-1.5 px-2.5 sm:px-3 rounded-xl border truncate ${badge.bg}`}>
                      {badge.label}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Quick Driver Assign (Desktop) */}
                  <button
                    onClick={() => setVehicleToAssign(veh)}
                    className="hidden sm:flex px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#DBEAFE] hover:bg-blue-100 text-[#2563EB] text-xs font-semibold items-center gap-1.5 transition cursor-pointer shrink-0"
                    title="Asignar o cambiar chofer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>
                      {veh.assignedDriverId ? 'Cambiar Chofer' : 'Asignar Chofer'}
                    </span>
                  </button>

                  {/* Quick Share Insurance */}
                  <button
                    onClick={() => openShareInsurance(veh.id)}
                    className="p-1.5 sm:p-2 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 transition cursor-pointer shrink-0"
                    title="Compartir datos del seguro en caso de siniestro o auxilio"
                  >
                    <Shield className="w-4 h-4 text-blue-600" />
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={() => onSelectVehicle(veh.id)}
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#172554] hover:bg-slate-900 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>Ver Ficha</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* 3-Dots Actions Menu */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() =>
                        setActiveMenuVehicleId(isMenuOpen ? null : veh.id)
                      }
                      className="p-1.5 sm:p-2 rounded-xl border border-[#DCE3ED] hover:bg-slate-50 text-slate-600 cursor-pointer"
                      title="Acciones adicionales"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setActiveMenuVehicleId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1.5 w-56 max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 text-xs">
                        <button
                          onClick={() => {
                            setActiveMenuVehicleId(null);
                            onSelectVehicle(veh.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 text-[#1E293B] cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4 text-blue-600" />
                          <span>Ver Ficha Completa</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuVehicleId(null);
                            openShareInsurance(veh.id);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-blue-50 text-blue-900 font-semibold cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span>Compartir Seguro (Siniestro)</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveMenuVehicleId(null);
                            setVehicleToAssign(veh);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 text-[#1E293B] cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>{veh.assignedDriverId ? 'Cambiar Chofer' : 'Asignar Chofer'}</span>
                        </button>

                        {veh.assignedDriverId && (
                          <button
                            onClick={() => {
                              setActiveMenuVehicleId(null);
                              assignDriverToVehicle(veh.id, null);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 text-amber-700 cursor-pointer"
                          >
                            <User className="w-4 h-4 text-amber-600" />
                            <span>Desasignar Chofer</span>
                          </button>
                        )}

                        {isOwner && (
                          <>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => {
                                setActiveMenuVehicleId(null);
                                setVehicleToEdit(veh);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-slate-50 text-[#1E293B] cursor-pointer"
                            >
                              <Edit className="w-4 h-4 text-slate-500" />
                              <span>Editar Unidad</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuVehicleId(null);
                                setVehicleToDelete(veh);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-rose-50 text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Eliminar Unidad</span>
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

      {/* Edit Vehicle Modal */}
      {vehicleToEdit && (
        <VehicleFormModal
          vehicleToEdit={vehicleToEdit}
          onClose={() => setVehicleToEdit(null)}
        />
      )}

      {/* Quick Assign Driver Modal */}
      {vehicleToAssign && (
        <QuickAssignDriverModal
          vehicle={vehicleToAssign}
          onClose={() => setVehicleToAssign(null)}
        />
      )}

      {/* Confirm Delete Vehicle Modal */}
      {vehicleToDelete && (
        <ConfirmDeleteModal
          isOpen={!!vehicleToDelete}
          onClose={() => setVehicleToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Estás seguro de que querés eliminar este vehículo?"
          itemName={`${vehicleToDelete.brand} ${vehicleToDelete.model}`}
          itemSubtitle={`Patente: ${vehicleToDelete.plate} · ${vehicleToDelete.year} · ${vehicleToDelete.costCenter || 'Flota'}`}
          warningDetails={deleteWarningDetails}
        />
      )}
    </div>
  );
};
