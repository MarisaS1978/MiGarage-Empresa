import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Driver } from '../../types';
import {
  Users,
  Plus,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  Truck,
  Trash2,
  Edit,
  CreditCard,
  Clock,
  Search,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { DriverFormModal } from './DriverFormModal';
import { DriverDetailModal } from './DriverDetailModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const DriversView: React.FC = () => {
  const {
    drivers,
    vehicles,
    deleteDriver,
    checkDriverRelations,
    openShareInsurance,
    isOwner,
    setSelectedVehicleId,
  } = useGarage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const today = new Date('2026-10-08');

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (driverToDelete) {
      deleteDriver(driverToDelete.id);
      setDriverToDelete(null);
    }
  };

  const deleteRelations = driverToDelete ? checkDriverRelations(driverToDelete.id) : null;
  const deleteWarningDetails: string[] = [];
  if (deleteRelations) {
    if (deleteRelations.assignedVehicle) {
      deleteWarningDetails.push(
        `Tiene asignada la unidad ${deleteRelations.assignedVehicle.brand} ${deleteRelations.assignedVehicle.model} (${deleteRelations.assignedVehicle.plate}). Se desasignará automáticamente.`
      );
    }
    if (deleteRelations.incidentsCount > 0) {
      deleteWarningDetails.push(
        `Tiene ${deleteRelations.incidentsCount} siniestro(s) registrados. El nombre del chofer se conservará en el historial para auditoría.`
      );
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Conductores de Flota
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Gestión de choferes asignados, licencias profesionales CNRT y control de vencimientos.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Conductor</span>
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
          placeholder="Buscar conductor por nombre, DNI o número de licencia..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((driver) => {
          const expDate = new Date(driver.licenseExpiry);
          const daysToExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          const isExpiringSoon = daysToExpiry <= 30 && daysToExpiry > 0;
          const isExpired = daysToExpiry <= 0;

          const assignedVehicle = vehicles.find((v) => v.id === driver.assignedVehicleId);

          return (
            <div
              key={driver.id}
              className={`bg-white rounded-3xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
                isExpired
                  ? 'border-rose-300 ring-2 ring-rose-400/20'
                  : isExpiringSoon
                  ? 'border-amber-300 ring-2 ring-amber-400/20'
                  : 'border-[#DCE3ED]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div
                    onClick={() => setSelectedDriverId(driver.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#DBEAFE] border border-blue-200 flex items-center justify-center font-bold text-[#172554] text-lg shrink-0">
                      {driver.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-[#172554] truncate hover:text-[#2563EB] transition">
                        {driver.name}
                      </h3>
                      <div className="text-xs text-[#64748B] font-mono">DNI: {driver.dni}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      driver.status === 'activo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : driver.status === 'licencia'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {driver.status === 'activo'
                      ? 'Activo'
                      : driver.status === 'licencia'
                      ? 'Licencia'
                      : 'Inactivo'}
                  </span>
                </div>

                {/* License and details */}
                <div className="space-y-2 py-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Licencia:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {driver.licenseNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Categoría:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[220px]">
                      {driver.licenseCategory}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Vencimiento:</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 font-mono">{driver.licenseExpiry}</span>
                      {isExpired ? (
                        <span className="block text-[11px] font-bold text-rose-700">
                          ⛔ Licencia vencida
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="block text-[11px] font-bold text-amber-700">
                          ⚠️ Vence en {daysToExpiry} días
                        </span>
                      ) : (
                        <span className="block text-[10px] text-emerald-700 font-semibold">
                          Al día
                        </span>
                      )}
                    </div>
                  </div>

                  {driver.phone && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[#64748B]">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{driver.phone}</span>
                    </div>
                  )}

                  {/* Assigned vehicle pill */}
                  {assignedVehicle ? (
                    <div className="mt-2 bg-[#F3F6FA] p-2.5 rounded-xl border border-[#DCE3ED] flex items-center justify-between gap-2">
                      <div
                        onClick={() => setSelectedVehicleId(assignedVehicle.id)}
                        className="flex items-center gap-2 truncate cursor-pointer hover:text-[#2563EB] transition"
                        title="Ver ficha del vehículo"
                      >
                        <Truck className="w-4 h-4 text-[#2563EB] shrink-0" />
                        <span className="text-slate-800 text-xs truncate">
                          {assignedVehicle.brand} {assignedVehicle.model}{' '}
                          <strong className="font-mono font-bold text-slate-900">
                            ({assignedVehicle.plate})
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => openShareInsurance(assignedVehicle.id)}
                          className="p-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition cursor-pointer"
                          title="Compartir datos de seguro y auxilio mecánico"
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold bg-[#DBEAFE] text-blue-900 px-2 py-0.5 rounded">
                          Asignado
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-400 text-[11px] italic">
                      Sin unidad de flota asignada
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDriverId(driver.id)}
                  className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Ficha Completa</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDriverToEdit(driver)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      title="Editar chofer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDriverToDelete(driver)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Eliminar chofer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <DriverFormModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Driver Modal */}
      {driverToEdit && (
        <DriverFormModal
          driverToEdit={driverToEdit}
          onClose={() => setDriverToEdit(null)}
        />
      )}

      {/* Driver Detail Modal */}
      {selectedDriverId && (
        <DriverDetailModal
          driverId={selectedDriverId}
          onClose={() => setSelectedDriverId(null)}
          onSelectVehicle={(vehId) => {
            setSelectedDriverId(null);
            setSelectedVehicleId(vehId);
          }}
        />
      )}

      {/* Confirm Delete Driver Modal */}
      {driverToDelete && (
        <ConfirmDeleteModal
          isOpen={!!driverToDelete}
          onClose={() => setDriverToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Querés eliminar a este chofer?"
          itemName={driverToDelete.name}
          itemSubtitle={`DNI: ${driverToDelete.dni} · Licencia: ${driverToDelete.licenseNumber}`}
          warningDetails={deleteWarningDetails}
        />
      )}
    </div>
  );
};
