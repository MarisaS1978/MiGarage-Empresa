import React, { useState, useEffect, useRef } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Truck,
  Edit,
} from 'lucide-react';
import { EditOwnerModal } from './EditOwnerModal';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  reason?: string;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Ingreso a Modo Administrador',
  reason,
}) => {
  const { loginAsOwner, availableUsers } = useGarage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditOwner, setShowEditOwner] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ownerUser =
    availableUsers.find((u) => u.role === 'propietario') || {
      name: 'Ing. Roberto Méndez',
      email: 'roberto.mendez@transporte-sa.com',
      title: 'Gerente General de Flota',
    };

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage(null);
      setIsSubmitting(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Por favor ingresá la clave de acceso de Modo Administrador.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = loginAsOwner(password);
    if (result.success) {
      setIsSubmitting(false);
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setIsSubmitting(false);
      setErrorMessage(result.error || 'Clave de acceso incorrecta. Intentá con "admin123".');
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  };

  const handleUseDefaultPassword = () => {
    setPassword('admin123');
    setErrorMessage(null);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-[#172554] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Cerrar y permanecer en Modo Chofer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Acceso Restringido
                </span>
                <span className="text-[10px] text-blue-200">Seguridad Flota</span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5 tracking-tight">
                {title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-blue-200 mt-2.5 leading-relaxed">
            {reason ||
              'Esta función requiere privilegios de administración. Ingresá la contraseña de administrador para desbloquear la gestión completa.'}
          </p>
        </div>

        {/* User Account Info Bar */}
        <div className="bg-[#F8FAFC] px-5 sm:px-6 py-3 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
              👑
            </div>
            <div className="min-w-0 truncate">
              <span className="font-extrabold text-[#172554] block truncate">
                {ownerUser.name}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">
                {ownerUser.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowEditOwner(true)}
              className="text-[11px] font-bold text-[#2563EB] hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer flex items-center gap-1"
              title="Cambiar persona o datos del Administrador"
            >
              <Edit className="w-3 h-3" />
              <span>Cambiar</span>
            </button>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#172554]">
              Administrador
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">{errorMessage}</p>
                <button
                  type="button"
                  onClick={handleUseDefaultPassword}
                  className="mt-1 text-[11px] text-rose-700 underline font-semibold hover:text-rose-900 cursor-pointer block"
                >
                  ¿Probar clave por defecto (admin123)?
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#172554] mb-1.5 flex items-center justify-between">
              <span>Clave de Acceso de Modo Administrador</span>
              <button
                type="button"
                onClick={handleUseDefaultPassword}
                className="text-[11px] text-[#2563EB] hover:text-blue-800 font-medium cursor-pointer"
              >
                Insertar clave demo
              </button>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Ingresá la contraseña (ej. admin123)"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Helper Hint */}
          <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Seguridad de Flota Activa</span>
            </div>
            <p className="text-blue-800 leading-normal">
              Por defecto, MiGarage inicia en <strong>Modo Chofer</strong> para proteger configuraciones críticas.
              La clave de acceso inicial es <strong className="font-mono bg-blue-100 px-1 py-0.5 rounded text-blue-950">admin123</strong> (o podés cambiarla en Configuración).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm cursor-pointer transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Verificando...' : 'Ingresar a Modo Administrador'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              <span>Permanecer en Modo Chofer</span>
            </button>
          </div>
        </form>
      </div>

      {showEditOwner && (
        <EditOwnerModal
          isOpen={showEditOwner}
          onClose={() => setShowEditOwner(false)}
        />
      )}
    </div>
  );
};
