import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Workshop } from '../../types';
import {
  Wrench,
  Plus,
  Phone,
  MapPin,
  Mail,
  User,
  Edit,
  Trash2,
  X,
  Search,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const WorkshopsView: React.FC = () => {
  const { workshops, addWorkshop, updateWorkshop, deleteWorkshop, isOwner, showToast } =
    useGarage();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [workshopToEdit, setWorkshopToEdit] = useState<Workshop | null>(null);
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const filteredWorkshops = workshops.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    if (!isOwner) {
      showToast('Solo el propietario puede agregar talleres o proveedores.', 'error');
      return;
    }
    setWorkshopToEdit(null);
    setName('');
    setSpecialty('');
    setPhone('');
    setAddress('');
    setContactPerson('');
    setEmail('');
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEdit = (ws: Workshop) => {
    if (!isOwner) {
      showToast('Solo el propietario puede modificar talleres o proveedores.', 'error');
      return;
    }
    setWorkshopToEdit(ws);
    setName(ws.name);
    setSpecialty(ws.specialty);
    setPhone(ws.phone);
    setAddress(ws.address);
    setContactPerson(ws.contactPerson || '');
    setEmail(ws.email || '');
    setNotes(ws.notes || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    if (!name.trim() || !specialty.trim() || !phone.trim() || !address.trim()) {
      showToast('Por favor completá los campos obligatorios.', 'warning');
      return;
    }

    const payload = {
      name: name.trim(),
      specialty: specialty.trim(),
      phone: phone.trim(),
      address: address.trim(),
      contactPerson: contactPerson.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (workshopToEdit) {
      updateWorkshop(workshopToEdit.id, payload);
    } else {
      addWorkshop(payload);
    }

    setShowModal(false);
  };

  const handleDeleteConfirm = () => {
    if (workshopToDelete) {
      deleteWorkshop(workshopToDelete.id);
      setWorkshopToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Talleres y Proveedores
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Red de prestadores homologados para mantenimiento, gomería, repuestos y electricidad.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Taller / Proveedor</span>
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
          placeholder="Buscar taller por nombre, rubro o dirección..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DCE3ED] text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
        />
      </div>

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkshops.map((ws) => (
          <div
            key={ws.id}
            className="bg-white rounded-3xl p-5 border border-[#DCE3ED] hover:border-[#2563EB]/40 transition shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#172554]">{ws.name}</h3>
                    <div className="text-xs font-semibold text-[#2563EB]">{ws.specialty}</div>
                  </div>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(ws)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      title="Editar taller"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setWorkshopToDelete(ws)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Eliminar taller"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 py-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Teléfono: <strong className="text-slate-800">{ws.phone}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{ws.address}</span>
                </div>

                {ws.contactPerson && (
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      Contacto: <strong>{ws.contactPerson}</strong>
                    </span>
                  </div>
                )}

                {ws.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{ws.email}</span>
                  </div>
                )}
              </div>
            </div>

            {ws.notes && (
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Condiciones: </span>
                <span>{ws.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#172554] mb-1">
              {workshopToEdit ? 'Editar Taller / Proveedor' : 'Registrar Nuevo Taller'}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Cargá los datos del taller para asociar a los mantenimientos y compras.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nombre del Taller / Razón Social <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Taller Central Mecánico S.A."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Especialidad / Rubro <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mecánica Pesada, Frenos, Inyección, Gomería..."
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Teléfono <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+54 11 4455-6677"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Mario Benítez (Jefe Taller)"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dirección <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Av. Juan B. Justo 7420, CABA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    placeholder="taller@proveedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Condiciones / Convenio Comercial
                </label>
                <textarea
                  rows={2}
                  placeholder="Cuenta corriente, plazos de pago, descuentos acordados..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCE3ED] text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  {workshopToEdit ? 'Guardar Cambios' : 'Registrar Taller'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {workshopToDelete && (
        <ConfirmDeleteModal
          isOpen={!!workshopToDelete}
          onClose={() => setWorkshopToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="¿Eliminar taller del directorio?"
          itemName={workshopToDelete.name}
          itemSubtitle={workshopToDelete.specialty}
        />
      )}
    </div>
  );
};
