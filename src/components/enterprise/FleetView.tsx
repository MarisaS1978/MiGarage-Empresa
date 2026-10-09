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
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por patente, marca, chofer o centro de costo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

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
              onClick={() => setStatusFilter(st.id)}
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
              className="bg-white rounded-3xl p-5 border border-[#DCE3ED] hover:border-[#2563EB]/50 transition shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative"
            >
              {/* Left Details */}
              <div
                onClick={() => onSelectVehicle(veh.id)}
                className="flex items-start sm:items-center gap-4 cursor-pointer flex-1 min-w-0"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {veh.photoUrl ? (
                    <img
                      src={veh.photoUrl}
                      alt={veh.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Truck className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#172554] text-white tracking-wider">
                      {veh.plate}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">
                      {veh.year} · {veh.type} · {veh.color}
                    </span>
                    {veh.costCenter && (
                      <span className="text-xs font-semibold text-blue-900 bg-[#DBEAFE] px-2 py-0.5 rounded border border-blue-200">
                        🏢 {veh.costCenter}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#172554] truncate">
                    {veh.brand} {veh.model}{' '}
                    {veh.version && (
                      <span className="text-xs text-[#64748B] font-normal">{veh.version}</span>
                    )}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                      <Gauge className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{veh.currentMileage.toLocaleString('es-AR')} km</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-stretch lg:self-center justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {/* Status Switcher Select (Owner only) */}
                {isOwner ? (
                  <select
                    value={currentStatus}
                    onChange={(e) => updateFleetStatus(veh.id, e.target.value as VehicleStatus)}
                    className={`text-xs font-bold py-2 px-3 rounded-xl border cursor-pointer focus:outline-hidden ${badge.bg}`}
                  >
                    <option value="disponible">🟢 Disponible</option>
                    <option value="en_uso">🔵 En uso</option>
                    <option value="mantenimiento">🟡 Mantenimiento</option>
                    <option value="fuera_de_servicio">🔴 Fuera de servicio</option>
                  </select>
                ) : (
                  <span className={`text-xs font-bold py-1.5 px-3 rounded-xl border ${badge.bg}`}>
                    {badge.label}
                  </span>
                )}

                {/* Quick Driver Assign / Change Button (Allowed for BOTH Owner and Driver) */}
                <button
                  onClick={() => setVehicleToAssign(veh)}
                  className="px-3 py-2 rounded-xl bg-[#DBEAFE] hover:bg-blue-100 text-[#2563EB] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  title="Asignar o cambiar chofer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {veh.assignedDriverId ? 'Cambiar Chofer' : 'Asignar Chofer'}
                  </span>
                </button>

                {/* View Details Button */}
                <button
                  onClick={() => onSelectVehicle(veh.id)}
                  className="px-3.5 py-2 rounded-xl bg-[#172554] hover:bg-slate-900 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                >
                  <span>Ver Ficha</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* 3-Dots Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenuVehicleId(isMenuOpen ? null : veh.id)
                    }
                    className="p-2 rounded-xl border border-[#DCE3ED] hover:bg-slate-50 text-slate-600 cursor-pointer"
                    title="Acciones adicionales"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setActiveMenuVehicleId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-40 text-xs">
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
