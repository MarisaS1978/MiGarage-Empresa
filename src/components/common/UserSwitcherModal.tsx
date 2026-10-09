import React from 'react';
import { useGarage } from '../../context/GarageContext';
import { AppUser } from '../../types';
import { Shield, Truck, Check, X, User } from 'lucide-react';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { availableUsers, currentUser, setCurrentUser } = useGarage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-3">
          <Shield className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-[#172554]">
          Control de Acceso y Roles
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Seleccioná la cuenta para simular o trabajar con los permisos correspondientes.
        </p>

        <div className="space-y-2.5 mt-4">
          {availableUsers.map((user) => {
            const isSelected = currentUser.id === user.id;
            const isOwner = user.role === 'propietario';

            return (
              <button
                key={user.id}
                onClick={() => {
                  setCurrentUser(user);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#DBEAFE]/40 ring-2 ring-[#2563EB]/20'
                    : 'border-[#DCE3ED] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isOwner
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}
                  >
                    {isOwner ? '👑' : '🚚'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {user.name}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          isOwner
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      {user.title || user.email}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Roles information explanation */}
        <div className="mt-4 p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] text-[11px] text-[#64748B] space-y-1">
          <div className="font-bold text-slate-800">Permisos del Sistema:</div>
          <div>
            <strong>• Rol Propietario:</strong> Gestión completa (Crear, editar y eliminar vehículos, choferes, mantenimientos, gastos, talleres, configuración).
          </div>
          <div>
            <strong>• Rol Chofer:</strong> Consulta autorizada y modificación exclusiva del chofer asignado en el desplegable de vehículos. Botones de alta, edición y eliminación bloqueados.
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
