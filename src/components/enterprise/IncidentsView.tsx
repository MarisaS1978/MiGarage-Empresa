import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Incident } from '../../types';
import {
  AlertTriangle,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Trash2,
  Edit,
  Shield,
  FileText,
  Search,
} from 'lucide-react';
import { IncidentModal } from './IncidentModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface IncidentsViewProps {
  onOpenQuickAction?: (actionType: 'siniestro') => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = () => {
  const { incidents, deleteIncident, openShareInsurance, isOwner } = useGarage();
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [incidentToEdit, setIncidentToEdit] = useState<Incident | null>(null);
  const [incidentToDelete, setIncidentToDelete] = useState<Incident | null>(null);

  const filtered = incidents.filter(
    (inc) =>
      inc.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.driverName && inc.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;

  const handleDeleteConfirm = () => {
    if (incidentToDelete) {
      deleteIncident(incidentToDelete.id);
      setIncidentToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Siniestros & Incidentes
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Gestión de denuncias a compañías de seguros, daños materiales, peritajes y terceros involucrados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md shadow-amber-900/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Denunciar Siniestro</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Casos Activos en Gestión</div>
          <div className="text-2xl font-bold text-amber-800 font-mono mt-1">
            {activeIncidents} casos
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">En peritaje o taller de chapa y pintura</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Total Siniestros Históricos</div>
          <div className="text-2xl font-bold text-[#172554] font-mono mt-1">
            {incidents.length} denuncias
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Trazabilidad completa con registros de choferes</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por vehículo, chofer, lugar o denuncia..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {filtered.map((inc) => (
          <div
            key={inc.id}
            className="bg-white rounded-3xl p-5 border border-[#DCE3ED] hover:border-[#2563EB]/40 transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                  {inc.type}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  {inc.vehicleName}
                </span>
                <span className="text-xs text-[#64748B] font-mono">
                  {inc.date} · {inc.time}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inc.status === 'resuelto'
                      ? 'bg-emerald-100 text-emerald-800'
                      : inc.status === 'rechazado'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {inc.status}
                </span>
              </div>

              <p className="text-xs text-[#1E293B] leading-relaxed">{inc.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#64748B]">
                <span>
                  Lugar: <strong>{inc.location}</strong>
                </span>
                {inc.driverName && (
                  <span>
                    Chofer involucrado: <strong className="text-slate-800">{inc.driverName}</strong>
                  </span>
                )}
                {inc.claimNumber && <span>Denuncia: {inc.claimNumber}</span>}
                {inc.estimatedCost ? (
                  <span>Costo est.: ${inc.estimatedCost.toLocaleString('es-AR')}</span>
                ) : null}
              </div>

              {inc.thirdParty && (
                <div className="mt-1 bg-[#F3F6FA] p-2.5 rounded-xl border border-[#DCE3ED] text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700">Tercero: </span>
                  <span>{inc.thirdParty.name}</span>
                  {inc.thirdParty.plate && <span> ({inc.thirdParty.plate})</span>}
                  {inc.thirdParty.phone && <span> · Tel: {inc.thirdParty.phone}</span>}
                  {inc.thirdParty.insuranceCompany && (
                    <span> · Seguro: {inc.thirdParty.insuranceCompany}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
              <button
                onClick={() => openShareInsurance(inc.vehicleId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition cursor-pointer shadow-xs"
                title="Compartir datos del seguro del vehículo de este siniestro"
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Compartir Seguro</span>
              </button>

              {isOwner && (
                <>
                  <button
                    onClick={() => setIncidentToEdit(inc)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
                    title="Editar siniestro"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIncidentToDelete(inc)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl cursor-pointer"
                    title="Eliminar siniestro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#DCE3ED] text-xs text-slate-500">
            No se encontraron siniestros registrados con los términos de búsqueda.
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <IncidentModal onClose={() => setShowAddModal(false)} />
      )}
      {incidentToEdit && (
        <IncidentModal
          incidentToEdit={incidentToEdit}
          onClose={() => setIncidentToEdit(null)}
        />
      )}
      {incidentToDelete && (
        <ConfirmDeleteModal
          isOpen={!!incidentToDelete}
          onClose={() => setIncidentToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar registro de siniestro?"
          itemName={`${incidentToDelete.type.toUpperCase()} — ${incidentToDelete.vehicleName}`}
          itemSubtitle={`Fecha: ${incidentToDelete.date} · Lugar: ${incidentToDelete.location}`}
        />
      )}
    </div>
  );
};
