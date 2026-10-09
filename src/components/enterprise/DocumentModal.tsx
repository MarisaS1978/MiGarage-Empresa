import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { VehicleDocument, DocumentType } from '../../types';
import { FileText, X } from 'lucide-react';

interface DocumentModalProps {
  onClose: () => void;
  documentToEdit?: VehicleDocument | null;
  defaultVehicleId?: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  onClose,
  documentToEdit,
  defaultVehicleId,
}) => {
  const { vehicles, addDocument, updateDocument, isOwner, showToast } = useGarage();

  const isEditing = !!documentToEdit;

  const [vehicleId, setVehicleId] = useState(
    documentToEdit?.vehicleId || defaultVehicleId || vehicles[0]?.id || ''
  );
  const [title, setTitle] = useState(documentToEdit?.title || '');
  const [type, setType] = useState<DocumentType>(documentToEdit?.type || 'cédula');
  const [expiryDate, setExpiryDate] = useState(documentToEdit?.expiryDate || '');
  const [description, setDescription] = useState(documentToEdit?.description || '');
  const [fileName, setFileName] = useState(documentToEdit?.fileName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (documentToEdit) {
      setVehicleId(documentToEdit.vehicleId);
      setTitle(documentToEdit.title);
      setType(documentToEdit.type);
      setExpiryDate(documentToEdit.expiryDate || '');
      setDescription(documentToEdit.description || '');
      setFileName(documentToEdit.fileName || '');
    }
  }, [documentToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      showToast('Solo el propietario puede registrar o editar documentos.', 'error');
      return;
    }

    const veh = vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    setIsSubmitting(true);
    try {
      const payload = {
        vehicleId,
        vehicleName: `${veh.brand} ${veh.model} (${veh.plate})`,
        title: title.trim(),
        type,
        expiryDate: expiryDate || undefined,
        description: description.trim() || undefined,
        fileName: fileName.trim() || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: '1.4 MB',
      };

      if (isEditing && documentToEdit) {
        updateDocument(documentToEdit.id, payload);
      } else {
        addDocument(payload);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Documento / RUTA' : 'Cargar Documentación de Unidad'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Registrá cédula verde, verificación R.U.T.A., VTV u homologaciones.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Vehículo <span className="text-rose-500">*</span>
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({v.plate})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tipo de Documento <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DocumentType)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-semibold capitalize"
              >
                <option value="cédula">Cédula del Automotor</option>
                <option value="seguro">Certificado de Seguro</option>
                <option value="vtv">VTV / Verificación Técnica</option>
                <option value="licencia">Licencia / Registro</option>
                <option value="factura">Factura / Título</option>
                <option value="comprobante">Comprobante R.U.T.A.</option>
                <option value="manual">Manual / Homologación</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título del Documento <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Certificado R.U.T.A. Transporte de Cargas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nombre de Archivo Digital
              </label>
              <input
                type="text"
                placeholder="documento_digital.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Descripción / Notas</label>
            <textarea
              rows={2}
              placeholder="Número de oblea, entidad emisora o vigencia..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#DCE3ED] text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Registrar Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
