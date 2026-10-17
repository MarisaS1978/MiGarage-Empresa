import React, { useState, useEffect, useRef } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  ShieldCheck,
  X,
  User,
  Mail,
  Briefcase,
  Image as ImageIcon,
  Check,
  Sparkles,
  Users,
  Upload,
  Camera,
  Trash2,
} from 'lucide-react';
import { compressImageFile } from '../../utils/imageCompressor';

interface EditOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  {
    label: 'Ejecutivo 1',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    label: 'Ejecutiva 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    label: 'Ejecutiva 3',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
  {
    label: 'Ejecutivo 4',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  },
  {
    label: 'Gerente 5',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
];

export const EditOwnerModal: React.FC<EditOwnerModalProps> = ({ isOpen, onClose }) => {
  const { availableUsers, updateOwnerProfile, drivers, showToast } = useGarage();

  const currentOwner =
    availableUsers.find((u) => u.role === 'propietario') || {
      name: 'Ing. Roberto Méndez',
      email: 'roberto.mendez@transporte-sa.com',
      title: 'Gerente General de Flota — Acceso Completo',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor seleccioná un archivo de imagen válido (JPG, PNG, WEBP).', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const compressedDataUrl = await compressImageFile(file, 400, 400, 0.88);
      setAvatarUrl(compressedDataUrl);
      showToast('Foto cargada y optimizada con éxito.', 'success');
    } catch (err: unknown) {
      console.error('Error al procesar foto:', err);
      const msg = err instanceof Error ? err.message : 'Error al procesar la imagen.';
      showToast(msg, 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    if (isOpen) {
      setName(currentOwner.name || '');
      setEmail(currentOwner.email || '');
      setTitle(currentOwner.title || 'Gerente General de Flota — Acceso Completo');
      setAvatarUrl(
        currentOwner.avatarUrl ||
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      );
      setSelectedDriverId('');
    }
  }, [isOpen, currentOwner.name, currentOwner.email, currentOwner.title, currentOwner.avatarUrl]);

  if (!isOpen) return null;

  const handleSelectDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
    if (!driverId) return;

    const drv = drivers.find((d) => d.id === driverId);
    if (drv) {
      setName(drv.name);
      setEmail(drv.email || `${drv.name.toLowerCase().replace(/\s+/g, '.')}@flota.com`);
      setTitle(`Administrador de Flota (Antes: ${drv.name})`);
      const matchedUser = availableUsers.find((u) => u.driverId === drv.id);
      if (matchedUser?.avatarUrl) {
        setAvatarUrl(matchedUser.avatarUrl);
      }
      showToast(`Datos del conductor ${drv.name} cargados en el formulario`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('El nombre del Administrador es obligatorio.', 'error');
      return;
    }

    updateOwnerProfile({
      name: name.trim(),
      email: email.trim() || 'administrador@flota.com',
      title: title.trim() || 'Gerente General de Flota — Acceso Completo',
      avatarUrl: avatarUrl.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172554] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Modo Administrador
                </span>
                <span className="text-[10px] text-blue-200">Gestión de Perfil</span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5 tracking-tight">
                Cambiar o Editar Administrador
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-200 mt-2 leading-relaxed">
            Actualizá la persona titular a cargo del Modo Administrador con acceso completo a vehículos, choferes y finanzas.
          </p>
        </div>

        {/* Current Summary Preview */}
        <div className="bg-[#F8FAFC] px-5 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={avatarUrl || currentOwner.avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-xl object-cover border border-amber-300 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80';
              }}
            />
            <div className="min-w-0 truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#172554] block truncate">
                  {name || 'Nuevo Administrador'}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded shrink-0">
                  👑 Administrador
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block truncate">
                {title || 'Gerente General de Flota'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Select from Drivers */}
          {drivers.length > 0 && (
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#172554]">
                <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>¿Asignar a un conductor de la empresa como Administrador?</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedDriverId}
                  onChange={(e) => handleSelectDriver(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
                >
                  <option value="">Seleccionar chofer para copiar datos...</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.email ? `(${d.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Nombre Completo */}
          <div>
            <label className="block text-xs font-bold text-[#172554] mb-1">
              Nombre Completo del Administrador *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Marisa Sandroni o Roberto Méndez"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#172554] mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@transporte-sa.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Cargo / Título */}
          <div>
            <label className="block text-xs font-bold text-[#172554] mb-1">
              Cargo / Título Institucional
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Dueña de Flota / Directora General"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Foto de Perfil / Subir Foto del Administrador */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#172554]">
              Foto del Administrador
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview Thumbnail */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 border-2 border-amber-300 shrink-0 shadow-sm group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto del Administrador"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                    <User className="w-8 h-8 text-slate-400" />
                    <span className="text-[9px] text-slate-500 font-bold mt-1">Sin foto</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white text-[10px] font-bold">
                    Cargando...
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{avatarUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    title="Tomar foto con cámara o abrir galería"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                    <span>Cámara / Galería</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                      title="Quitar foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Quitar</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  Subí una foto desde tu celular o computadora (JPG, PNG o WEBP). Se optimiza automáticamente.
                </p>
              </div>
            </div>

            {/* Alternativas: URL y Avatares Sugeridos */}
            <div className="pt-1">
              <details className="group text-xs text-slate-600">
                <summary className="font-semibold text-[11px] text-[#2563EB] hover:text-blue-800 list-none flex items-center gap-1 cursor-pointer select-none">
                  <span>▾ Opcional: Pegar enlace URL o elegir avatar de demostración</span>
                </summary>
                <div className="pt-2 space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="url"
                      value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                    <span className="text-[10px] text-slate-500 font-semibold shrink-0">
                      Avatares demo:
                    </span>
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset.url)}
                        className={`w-7 h-7 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                          avatarUrl === preset.url
                            ? 'border-[#2563EB] ring-2 ring-[#2563EB]/30'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Carga Rápida de Administrador</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setName('Marisa Sandroni');
                  setEmail('marisa.sandroni@flota-sa.com');
                  setTitle('Propietaria & Directora General de Flota');
                  setAvatarUrl(
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
                  );
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] cursor-pointer transition border border-amber-300"
              >
                👤 Marisa Sandroni (Propietaria)
              </button>

              <button
                type="button"
                onClick={() => {
                  setName('Ing. Roberto Méndez');
                  setEmail('roberto.mendez@transporte-sa.com');
                  setTitle('Gerente General de Flota');
                  setAvatarUrl(
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
                  );
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold text-[10px] cursor-pointer transition border border-slate-300"
              >
                👤 Ing. Roberto Méndez
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Administrador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
