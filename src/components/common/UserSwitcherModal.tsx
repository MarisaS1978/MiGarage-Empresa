import React from 'react';
import { useGarage } from '../../context/GarageContext';
import { AppUser } from '../../types';
import { Shield, Truck, Check, X, User, Lock, KeyRound } from 'lucide-react';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    availableUsers,
    currentUser,
    setCurrentUser,
    isOwnerAuthenticated,
    openOwnerLoginModal,
    logoutOwner,
  } = useGarage();

  if (!isOpen) return null;

  const handleSelectUser = (user: AppUser) => {
    if (user.role === 'propietario') {
      if (!isOwnerAuthenticated) {
        onClose();
        openOwnerLoginModal(
          `Para ingresar con la cuenta de Propietario (${user.name}) se requiere autenticación con clave.`
        );
        return;
      }
      setCurrentUser(user);
      onClose();
    } else {
      // Driver selected
      if (currentUser.role === 'propietario') {
        logoutOwner();
      }
      setCurrentUser(user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-3">
          <Shield className="w-6 h-6" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#172554]">
              Control de Acceso y Roles
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Por seguridad, el modo por defecto es <strong>Chofer</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 mt-4">
          {availableUsers.map((user) => {
            const isSelected = currentUser.id === user.id;
            const isUserOwner = user.role === 'propietario';

            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#DBEAFE]/40 ring-2 ring-[#2563EB]/20'
                    : 'border-[#DCE3ED] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isUserOwner
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}
                  >
                    {isUserOwner ? '👑' : '🚚'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {user.name}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          isUserOwner
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>

                      {isUserOwner && !isOwnerAuthenticated && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Requiere Clave</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {user.title || user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isUserOwner && !isOwnerAuthenticated && !isSelected && (
                    <KeyRound className="w-4 h-4 text-amber-500 opacity-80" />
                  )}

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Roles information explanation */}
        <div className="mt-4 p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] text-[11px] text-[#64748B] space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Seguridad del Modo Propietario:</span>
          </div>
          <div>
            <strong>• Modo Chofer (Por Defecto):</strong> Visualiza la unidad asignada, métricas operativas y permite registrar cargas de combustible y siniestros.
          </div>
          <div>
            <strong>• Modo Propietario (Protegido con Login):</strong> Control integral de vehículos, choferes, talleres, finanzas y reportes corporativos.
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
