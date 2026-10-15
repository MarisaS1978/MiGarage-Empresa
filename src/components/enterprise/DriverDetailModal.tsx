import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Driver } from '../../types';
import {
  Users,
  X,
  Phone,
  Mail,
  Truck,
  CreditCard,
  Calendar,
  AlertTriangle,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  Shield,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { DriverFormModal } from './DriverFormModal';

interface DriverDetailModalProps {
  driverId: string;
  onClose: () => void;
  onSelectVehicle?: (vehicleId: string) => void;
}

export const DriverDetailModal: React.FC<DriverDetailModalProps> = ({
  driverId,
  onClose,
  onSelectVehicle,
}) => {
  const {
    drivers,
    vehicles,
    incidents,
    deleteDriver,
    checkDriverRelations,
    assignDriverToVehicle,
    openShareInsurance,
    isOwner,
  } = useGarage();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const driver = drivers.find((d) => d.id === driverId);
  if (!driver) return null;

  const assignedVehicle = vehicles.find((v) => v.id === driver.assignedVehicleId);
  const driverIncidents = incidents.filter(
    (inc) => inc.driverId === driver.id || inc.driverName === driver.name
  );

  const today = new Date('2026-10-08');
  const expDate = new Date(driver.licenseExpiry);
  const daysToExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const isExpiringSoon = daysToExpiry <= 30 && daysToExpiry > 0;
  const isExpired = daysToExpiry <= 0;

  const relations = checkDriverRelations(driver.id);

  const handleDeleteConfirm = () => {
    deleteDriver(driver.id);
    setShowDeleteModal(false);
    onClose();
  };

  const handleUnassignVehicle = () => {
    if (assignedVehicle) {
      assignDriverToVehicle(assignedVehicle.id, null);
    }
  };

  const warningList: string[] = [];
  if (assignedVehicle) {
    warningList.push(
      `Tiene asignada la unidad ${assignedVehicle.brand} ${assignedVehicle.model} (${assignedVehicle.plate}). Se desasignará automáticamente.`
    );
  }
  if (driverIncidents.length > 0) {
    warningList.push(
      `Tiene ${driverIncidents.length} siniestro(s) en su historial. El registro histórico mantendrá el nombre del chofer por auditoría.`
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-150">
        <div className="relative bg-white rounded-3xl w-full max-w-2xl p-4 sm:p-6 md:p-7 shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#DBEAFE] border border-blue-200 flex items-center justify-center font-extrabold text-[#172554] text-2xl shrink-0">
                {driver.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-extrabold text-[#172554] tracking-tight">
                    {driver.name}
                  </h2>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
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
                      ? 'De Licencia'
                      : 'Inactivo'}
                  </span>
                </div>
                <div className="text-xs text-[#64748B] flex flex-wrap items-center gap-3">
                  <span>
                    DNI: <strong className="text-slate-800 font-mono">{driver.dni}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Tel: <strong className="text-slate-800">{driver.phone || 'No registrado'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E293B] text-xs font-semibold transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Eliminar conductor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 mt-5">
            {/* Licencia de Conducir Box */}
            <div
              className={`p-4 rounded-2xl border ${
                isExpired
                  ? 'bg-rose-50/70 border-rose-200'
                  : isExpiringSoon
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-[#F3F6FA] border-[#DCE3ED]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs text-[#172554]">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  <span>Licencia Nacional de Conducir</span>
                </div>
                {isExpired ? (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    ⛔ Licencia Vencida
                  </span>
                ) : isExpiringSoon ? (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    ⚠️ Vence en {daysToExpiry} días
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    ✓ Vigente ({daysToExpiry} días)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[11px] text-[#64748B]">N° de Licencia:</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {driver.licenseNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#64748B]">Categoría Habilitada:</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {driver.licenseCategory}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#64748B]">Fecha de Vencimiento:</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {driver.licenseExpiry}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehículo Asignado Box */}
            <div className="p-4 rounded-2xl bg-white border border-[#DCE3ED] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-xs text-[#172554]">
                  <Truck className="w-4 h-4 text-[#2563EB]" />
                  <span>Unidad de Flota Asignada</span>
                </div>
                {assignedVehicle && isOwner && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="text-[11px] text-[#2563EB] hover:text-blue-800 hover:underline cursor-pointer font-semibold"
                    >
                      Cambiar Unidad
                    </button>
                    <button
                      onClick={handleUnassignVehicle}
                      className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline cursor-pointer font-semibold"
                    >
                      Desasignar Unidad
                    </button>
                  </div>
                )}
              </div>

              {assignedVehicle ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] gap-2.5">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      {assignedVehicle.plate}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {assignedVehicle.brand} {assignedVehicle.model}{' '}
                        {assignedVehicle.version && (
                          <span className="text-slate-500 font-normal">
                            ({assignedVehicle.version})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {assignedVehicle.year} · {assignedVehicle.type} ·{' '}
                        {assignedVehicle.currentMileage.toLocaleString('es-AR')} km ·{' '}
                        <strong className="text-blue-800">{assignedVehicle.costCenter}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => openShareInsurance(assignedVehicle.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                      title="Compartir datos de seguro y auxilio mecánico"
                    >
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Seguro</span>
                    </button>

                    {onSelectVehicle && (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectVehicle(assignedVehicle.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 hover:bg-slate-800 cursor-pointer"
                      >
                        <span>Ver Ficha</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-500 italic">
                    Este chofer no tiene actualmente ninguna unidad asignada en la flota.
                  </span>
                  {isOwner && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white font-semibold flex items-center gap-1 hover:bg-blue-700 cursor-pointer text-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Asignar Unidad</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Siniestros asociados */}
            {driverIncidents.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-[#DCE3ED]">
                <div className="flex items-center gap-2 font-bold text-xs text-[#172554] mb-3">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Historial de Siniestros Vinculados ({driverIncidents.length})</span>
                </div>
                <div className="space-y-2.5">
                  {driverIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full max-w-full overflow-hidden"
                    >
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-900 leading-snug">
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase font-bold text-[10px] shrink-0">
                            {inc.type}
                          </span>
                          <span className="text-slate-800 font-mono text-[11px] shrink-0">{inc.date}</span>
                          <span className="text-slate-600 font-medium [overflow-wrap:anywhere] break-words min-w-0">
                            · {inc.vehicleName}
                          </span>
                        </div>
                        {inc.description && (
                          <div className="text-[11px] text-slate-600 leading-relaxed [overflow-wrap:anywhere] break-words whitespace-normal">
                            {inc.description}
                          </div>
                        )}
                        {inc.location && (
                          <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="text-slate-400 shrink-0">Lugar:</span>
                            <span className="font-medium text-slate-700 [overflow-wrap:anywhere] break-words">{inc.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 self-start sm:self-auto pt-0.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block whitespace-nowrap capitalize ${
                            inc.status === 'resuelto'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : inc.status === 'rechazado'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {inc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observaciones */}
            {driver.notes && (
              <div className="p-3 rounded-2xl bg-[#F3F6FA] text-xs text-slate-600">
                <span className="font-bold text-slate-700">Notas de legajo: </span>
                <span>{driver.notes}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-5 mt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#172554] hover:bg-slate-900 text-white font-semibold text-xs cursor-pointer"
            >
              Cerrar Ficha
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <DriverFormModal
          driverToEdit={driver}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="¿Querés eliminar a este chofer?"
          itemName={driver.name}
          itemSubtitle={`DNI: ${driver.dni} · Licencia: ${driver.licenseNumber}`}
          warningDetails={warningList}
        />
      )}
    </>
  );
};
