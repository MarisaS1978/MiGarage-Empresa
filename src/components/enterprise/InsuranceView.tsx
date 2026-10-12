import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { InsurancePolicy } from '../../types';
import {
  Shield,
  Plus,
  Phone,
  Calendar,
  AlertTriangle,
  FileCheck,
  Edit,
  Trash2,
  Search,
  Share2,
} from 'lucide-react';
import { InsuranceModal } from './InsuranceModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const InsuranceView: React.FC = () => {
  const { insurance, deleteInsurancePolicy, openShareInsurance, isOwner } = useGarage();
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [policyToEdit, setPolicyToEdit] = useState<InsurancePolicy | null>(null);
  const [policyToDelete, setPolicyToDelete] = useState<InsurancePolicy | null>(null);

  const filtered = insurance.filter(
    (p) =>
      p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMonthly = insurance.reduce((sum, p) => sum + (p.monthlyPremium || 0), 0);

  const handleDeleteConfirm = () => {
    if (policyToDelete) {
      deleteInsurancePolicy(policyToDelete.id);
      setPolicyToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Seguros Corporativos
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Coberturas de flota, pólizas vigentes, asistencia en ruta y gestión de primas mensuales.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Póliza</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Total Primas Mensuales de Flota</div>
          <div className="text-2xl font-bold text-[#172554] font-mono mt-1">
            ${totalMonthly.toLocaleString('es-AR')} / mes
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">{insurance.length} unidades aseguradas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Cobertura Predominante</div>
          <div className="text-2xl font-bold text-[#15803D] font-mono mt-1">
            Todo Riesgo Corporativo
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Con franquicias fijas y remolque 24h</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por compañía, póliza o vehículo..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pol) => (
          <div
            key={pol.id}
            className="bg-white rounded-3xl p-5 border border-[#DCE3ED] hover:border-[#2563EB]/40 transition shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#172554]">{pol.company}</h3>
                    <div className="text-xs text-[#2563EB] font-bold font-mono">
                      {pol.vehicleName}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#15803D]">
                  Vigente
                </span>
              </div>

              <div className="space-y-2 py-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">N° de Póliza:</span>
                  <span className="font-mono font-bold text-slate-900">{pol.policyNumber}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Cobertura:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                    {pol.coverageType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Vencimiento:</span>
                  <span className="font-mono font-bold text-slate-900">{pol.expiryDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Auxilio en Ruta 24h:</span>
                  <span className="font-bold text-[#2563EB]">{pol.assistancePhone}</span>
                </div>

                {pol.monthlyPremium && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-[#64748B]">Cuota Mensual:</span>
                    <span className="font-mono font-bold text-slate-900">
                      ${pol.monthlyPremium.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => openShareInsurance(pol.vehicleId)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition cursor-pointer border border-blue-200"
                title="Compartir datos de póliza para siniestro o auxilio"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Compartir Ficha Siniestro</span>
              </button>

              <div className="flex items-center gap-1">
                {isOwner && (
                  <>
                    <button
                      onClick={() => setPolicyToEdit(pol)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      title="Editar póliza"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPolicyToDelete(pol)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Eliminar póliza"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <InsuranceModal onClose={() => setShowAddModal(false)} />
      )}
      {policyToEdit && (
        <InsuranceModal
          policyToEdit={policyToEdit}
          onClose={() => setPolicyToEdit(null)}
        />
      )}
      {policyToDelete && (
        <ConfirmDeleteModal
          isOpen={!!policyToDelete}
          onClose={() => setPolicyToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar póliza de seguro?"
          itemName={`${policyToDelete.company} — Póliza ${policyToDelete.policyNumber}`}
          itemSubtitle={`Vehículo: ${policyToDelete.vehicleName}`}
        />
      )}
    </div>
  );
};
