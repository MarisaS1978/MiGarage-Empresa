import React, { useState, useEffect, useRef } from 'react';
import { useGarage } from '../../context/GarageContext';
import { VehicleType, FuelType, Vehicle, VehicleStatus } from '../../types';
import { Truck, X, AlertCircle, Upload, Camera, Image as ImageIcon, Trash2, Lock, Sparkles } from 'lucide-react';

interface VehicleFormModalProps {
  onClose: () => void;
  vehicleToEdit?: Vehicle | null;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ onClose, vehicleToEdit }) => {
  const {
    addVehicle,
    updateVehicle,
    drivers,
    vehicles,
    isOwner,
    openOwnerLoginModal,
    showToast,
  } = useGarage();

  const isEditing = !!vehicleToEdit;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [brand, setBrand] = useState(vehicleToEdit?.brand || '');
  const [model, setModel] = useState(vehicleToEdit?.model || '');
  const [version, setVersion] = useState(vehicleToEdit?.version || '');
  const [year, setYear] = useState(vehicleToEdit?.year || 2022);
  const [plate, setPlate] = useState(vehicleToEdit?.plate || '');
  const [color, setColor] = useState(vehicleToEdit?.color || 'Blanco');
  const [currentMileage, setCurrentMileage] = useState(vehicleToEdit?.currentMileage || 50000);
  const [type, setType] = useState<VehicleType>(vehicleToEdit?.type || 'camioneta');
  const [fuelType, setFuelType] = useState<FuelType>(vehicleToEdit?.fuelType || 'diesel');
  const [fleetStatus, setFleetStatus] = useState<VehicleStatus>(vehicleToEdit?.fleetStatus || 'disponible');
  const [costCenter, setCostCenter] = useState(vehicleToEdit?.costCenter || 'Operaciones Logística');
  const [assignedDriverId, setAssignedDriverId] = useState(vehicleToEdit?.assignedDriverId || '');
  const [notes, setNotes] = useState(vehicleToEdit?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(vehicleToEdit?.photoUrl || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor seleccioná un archivo de imagen (JPG, PNG, WEBP).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('La imagen supera el límite de 8MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        showToast('Foto cargada exitosamente.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (vehicleToEdit) {
      setBrand(vehicleToEdit.brand);
      setModel(vehicleToEdit.model);
      setVersion(vehicleToEdit.version || '');
      setYear(vehicleToEdit.year);
      setPlate(vehicleToEdit.plate);
      setColor(vehicleToEdit.color);
      setCurrentMileage(vehicleToEdit.currentMileage);
      setType(vehicleToEdit.type);
      setFuelType(vehicleToEdit.fuelType);
      setFleetStatus(vehicleToEdit.fleetStatus || 'disponible');
      setCostCenter(vehicleToEdit.costCenter || 'Operaciones Logística');
      setAssignedDriverId(vehicleToEdit.assignedDriverId || '');
      setNotes(vehicleToEdit.notes || '');
      setPhotoUrl(vehicleToEdit.photoUrl || '');
    }
  }, [vehicleToEdit]);

  // Check if selected driver is currently assigned to another vehicle
  const selectedDriver = drivers.find((d) => d.id === assignedDriverId);
  const driverCurrentVehicle = selectedDriver
    ? vehicles.find(
        (v) =>
          v.assignedDriverId === selectedDriver.id &&
          (!vehicleToEdit || v.id !== vehicleToEdit.id)
      )
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      showToast('Solo el propietario puede registrar o modificar la ficha del vehículo.', 'error');
      return;
    }

    if (!brand.trim() || !model.trim() || !plate.trim()) {
      showToast('Completá los campos obligatorios: Marca, Modelo y Patente.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const defaultPhoto =
        type === 'camioneta'
          ? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
          : type === 'utilitario'
          ? 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';

      const payload = {
        mode: 'enterprise' as const,
        brand: brand.trim(),
        model: model.trim(),
        version: version.trim() || undefined,
        year: Number(year),
        plate: plate.trim().toUpperCase(),
        color: color.trim(),
        currentMileage: Number(currentMileage),
        type,
        fuelType,
        photoUrl: photoUrl.trim() || defaultPhoto,
        generalStatus:
          fleetStatus === 'disponible' || fleetStatus === 'en_uso'
            ? ('optimo' as const)
            : fleetStatus === 'mantenimiento'
            ? ('atencion' as const)
            : ('urgente' as const),
        fleetStatus,
        costCenter,
        assignedDriverId: assignedDriverId || undefined,
        assignedDriverName: selectedDriver ? selectedDriver.name : undefined,
        notes: notes.trim() || undefined,
      };

      if (isEditing && vehicleToEdit) {
        const ok = updateVehicle(vehicleToEdit.id, payload);
        if (ok) onClose();
      } else {
        const ok = addVehicle(payload);
        if (ok) onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format driver options: "Juan Pérez — DNI terminado en 123"
  const formatDriverOption = (d: typeof drivers[0]) => {
    const cleanDni = d.dni.replace(/\D/g, '');
    const last3 = cleanDni.slice(-3);
    const suffix = last3 ? `DNI terminado en ${last3}` : `DNI ${d.dni}`;
    const isOtherAssigned =
      d.assignedVehicleId && (!vehicleToEdit || d.assignedVehicleId !== vehicleToEdit.id);
    return `${d.name} — ${suffix}${isOtherAssigned ? ' (En otra unidad)' : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-xl p-4 sm:p-6 md:p-7 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#172554]">
              {isEditing ? 'Editar Unidad de Flota' : 'Incorporar Unidad a la Flota'}
            </h3>
            <p className="text-xs text-[#64748B]">
              {isEditing
                ? `Actualizá la información técnica, operativa y chofer asignado para ${vehicleToEdit.plate}.`
                : 'Registrá un nuevo vehículo comercial para el control de la flota.'}
            </p>
          </div>
        </div>

        {/* Banner if not owner */}
        {!isOwner && (
          <div className="my-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-semibold truncate">
                Para guardar cambios o subir fotos, necesitás ingresar en Modo Propietario.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                openOwnerLoginModal('Ingresá tu clave de Propietario para editar la flota.');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shrink-0 cursor-pointer shadow-xs"
            >
              Desbloquear
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4">
          {/* Foto de la Unidad con subida de imagen */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#DCE3ED] space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#1E293B] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#2563EB]" />
                <span>Foto del Vehículo</span>
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {showUrlInput ? 'Ocultar enlace web' : 'Ingresar enlace web'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Photo Preview Thumbnail */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-300 shrink-0 shadow-xs relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto del vehículo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-1 text-center">
                    <Truck className="w-6 h-6 mb-1 text-slate-400" />
                    <span className="text-[9px] text-slate-500 leading-tight">Sin foto</span>
                  </div>
                )}
              </div>

              {/* Upload & Action Buttons */}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{photoUrl ? 'Cambiar Foto' : 'Subir Imagen'}</span>
                  </button>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="px-2.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold flex items-center gap-1 transition cursor-pointer text-xs"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Quitar</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  Subí una foto de la unidad (JPG, PNG o WEBP de tu celular o computadora).
                </p>
              </div>
            </div>

            {/* URL input fallback if needed */}
            {showUrlInput && (
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Enlace directo a imagen (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white border border-[#DCE3ED] text-[#1E293B] text-xs focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
                />
              </div>
            )}
          </div>
          {/* Marca y Modelo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Marca <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Toyota, Mercedes-Benz, Ford"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Modelo <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Hilux, Sprinter, Kangoo"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Versión, Año y Patente */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Versión / Motor</label>
              <input
                type="text"
                placeholder="Ej: 2.8 TDI 4x4 DX"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Año <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1990"
                max="2035"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Patente / Dominio <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="AF 342 OP"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono font-bold uppercase focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Tipo, Combustible, Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Tipo de Unidad</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold capitalize focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              >
                <option value="camioneta">Camioneta</option>
                <option value="utilitario">Utilitario / Furgón</option>
                <option value="automóvil">Automóvil</option>
                <option value="motocicleta">Motocicleta</option>
                <option value="otro">Otro comercial</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Combustible</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as FuelType)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold capitalize focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              >
                <option value="diesel">Diésel Grado 3</option>
                <option value="nafta">Nafta Súper/Premium</option>
                <option value="gnc">GNC</option>
                <option value="híbrido">Híbrido</option>
                <option value="eléctrico">Eléctrico</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Color</label>
              <input
                type="text"
                placeholder="Blanco, Gris, Rojo..."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Kilometraje y Estado de Flota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Kilometraje actual <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={currentMileage}
                onChange={(e) => setCurrentMileage(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-mono font-bold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Estado de Flota</label>
              <select
                value={fleetStatus}
                onChange={(e) => setFleetStatus(e.target.value as VehicleStatus)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              >
                <option value="disponible">🟢 Disponible para uso</option>
                <option value="en_uso">🔵 En ruta / En uso</option>
                <option value="mantenimiento">🟡 En mantenimiento preventivo</option>
                <option value="fuera_de_servicio">🔴 Fuera de servicio / Taller</option>
              </select>
            </div>
          </div>

          {/* Centro de Costo y Menú Desplegable Chofer Asignado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Centro de Costo</label>
              <select
                value={costCenter}
                onChange={(e) => setCostCenter(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              >
                <option value="Operaciones Logística">Operaciones Logística</option>
                <option value="Distribución Mayorista">Distribución Mayorista</option>
                <option value="Envíos Rápidos AMBA">Envíos Rápidos AMBA</option>
                <option value="Campo y Obras">Campo y Obras</option>
                <option value="Gerencia Operativa">Gerencia Operativa</option>
                <option value="Mantenimiento Técnico">Mantenimiento Técnico</option>
                <option value="Supervisión de Rutas">Supervisión de Rutas</option>
                <option value="Paquetería y Encomiendas">Paquetería y Encomiendas</option>
                <option value="Dirección Comercial">Dirección Comercial</option>
              </select>
            </div>

            {/* CHOFER ASIGNADO (Menú desplegable) */}
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Chofer asignado
              </label>
              <select
                value={assignedDriverId}
                onChange={(e) => setAssignedDriverId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] font-semibold focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
              >
                <option value="">(Sin asignar)</option>
                {drivers
                  .filter((d) => d.status === 'activo' || d.id === assignedDriverId)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {formatDriverOption(d)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Aviso claro si el chofer ya tiene asignado otro vehículo */}
          {driverCurrentVehicle && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">Aviso de reasignación:</span>{' '}
                <strong>{selectedDriver?.name}</strong> ya tiene asignada la unidad{' '}
                <strong>
                  {driverCurrentVehicle.brand} {driverCurrentVehicle.model} ({driverCurrentVehicle.plate})
                </strong>
                . Al guardar, el chofer se reasignará a esta unidad y la unidad anterior quedará sin chofer.
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">Observaciones / Notas</label>
            <textarea
              rows={2}
              placeholder="Detalles sobre radicación, equipamiento, número de chasis o póliza..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] focus:outline-hidden"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE3ED]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#DCE3ED] text-[#1E293B] hover:bg-slate-100 font-semibold transition cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Incorporar Vehículo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
