import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { VehicleDocument } from '../../types';
import {
  FileText,
  Plus,
  Calendar,
  AlertTriangle,
  Download,
  Trash2,
  Edit,
  Search,
  Filter,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { DocumentModal } from './DocumentModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const DocumentsView: React.FC = () => {
  const { documents, deleteDocument, isOwner } = useGarage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');

  const [showAddModal, setShowAddModal] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState<VehicleDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<VehicleDocument | null>(null);

  const today = new Date('2026-10-08');

  const filtered = documents.filter((doc) => {
    const matchesFilter = filterType === 'todos' || doc.type === filterType;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Documentación & R.U.T.A.
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Gestión digital de cédulas, pólizas de seguro, certificados RUTA y verificaciones técnicas de flota.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cargar Documento</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por vehículo, título u oblea..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['todos', 'seguro', 'comprobante', 'vtv', 'cédula'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                filterType === type
                  ? 'bg-[#172554] text-white'
                  : 'bg-white text-slate-600 border border-[#DCE3ED] hover:bg-slate-50'
              }`}
            >
              {type === 'comprobante' ? 'R.U.T.A.' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((doc) => {
          let isExpired = false;
          let isExpiringSoon = false;
          let daysLeft = 999;

          if (doc.expiryDate) {
            const exp = new Date(doc.expiryDate);
            daysLeft = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
            isExpired = daysLeft <= 0;
            isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
          }

          return (
            <div
              key={doc.id}
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
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#172554] leading-tight">
                        {doc.title}
                      </h3>
                      <div className="text-xs text-[#2563EB] font-bold font-mono mt-0.5">
                        {doc.vehicleName}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#F3F6FA] text-slate-700 border border-slate-200">
                    {doc.type}
                  </span>
                </div>

                <div className="space-y-2 py-3 text-xs text-slate-600">
                  {doc.description && <p className="text-slate-700">{doc.description}</p>}

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-[#64748B]">Vencimiento:</span>
                    <div>
                      {doc.expiryDate ? (
                        <>
                          <span className="font-mono font-bold text-slate-900">{doc.expiryDate}</span>
                          {isExpired ? (
                            <span className="ml-2 font-bold text-[#B91C1C]">⛔ Vencido</span>
                          ) : isExpiringSoon ? (
                            <span className="ml-2 font-bold text-[#B45309]">
                              ⚠️ Vence en {daysLeft} días
                            </span>
                          ) : (
                            <span className="ml-2 text-[#15803D] font-semibold">✓ Al día</span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400">Sin fecha de caducidad</span>
                      )}
                    </div>
                  </div>

                  {doc.fileName && (
                    <div className="flex items-center justify-between text-[11px] text-[#64748B] bg-[#F3F6FA] p-2 rounded-xl">
                      <span className="truncate max-w-[200px]">📄 {doc.fileName}</span>
                      <span>{doc.fileSize || '1.2 MB'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Cargado: {doc.createdAt}</span>

                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDocumentToEdit(doc)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      title="Editar documento"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDocumentToDelete(doc)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Eliminar documento"
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

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#DCE3ED] text-xs text-slate-500">
          No se encontraron documentos registrados con los filtros aplicados.
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <DocumentModal onClose={() => setShowAddModal(false)} />
      )}
      {documentToEdit && (
        <DocumentModal
          documentToEdit={documentToEdit}
          onClose={() => setDocumentToEdit(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {documentToDelete && (
        <ConfirmDeleteModal
          isOpen={!!documentToDelete}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar documento de la flota?"
          itemName={documentToDelete.title}
          itemSubtitle={`Vehículo: ${documentToDelete.vehicleName}`}
        />
      )}
    </div>
  );
};
