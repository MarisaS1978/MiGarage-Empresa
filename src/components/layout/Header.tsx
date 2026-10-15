import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Truck,
  Plus,
  RefreshCw,
  Bell,
  UserCheck,
  Shield,
  ChevronDown,
  Lock,
  LogOut,
} from 'lucide-react';
import { UserSwitcherModal } from '../common/UserSwitcherModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface HeaderProps {
  onOpenQuickAction: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAction, onOpenNotifications }) => {
  const {
    currentUser,
    isOwner,
    resetToDemoData,
    unreadAlertsCount,
    openOwnerLoginModal,
    logoutOwner,
  } = useGarage();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#172554] border-b border-blue-900/60 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-3 w-full min-w-0">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-900/40 shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white truncate">
                  MiGarage
                </span>
                <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#2563EB] text-white shrink-0">
                  Empresa
                </span>
              </div>
              <p className="text-[11px] text-blue-200 hidden md:block truncate">
                Gestión Integral de Flotas y Choferes
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Owner Login / Logout Button */}
            {!isOwner ? (
              <button
                onClick={() =>
                  openOwnerLoginModal(
                    'Ingresá tu contraseña de Administrador para desbloquear el control total de flota.'
                  )
                }
                className="flex items-center justify-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
                title="Ingresar a Modo Administrador con clave"
                aria-label="Ingresar a Modo Administrador"
              >
                <Lock className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">Modo Administrador</span>
              </button>
            ) : (
              <button
                onClick={logoutOwner}
                className="flex items-center justify-center gap-1 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold transition cursor-pointer shrink-0"
                title="Cerrar sesión de Administrador y volver a Modo Chofer por seguridad"
                aria-label="Cerrar sesión de Administrador"
              >
                <LogOut className="w-4 h-4 text-rose-300" />
                <span className="hidden sm:inline">Salir a Chofer</span>
              </button>
            )}

            {/* Active User Pill with Role Indicator & Switcher */}
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-1 sm:gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-blue-400/30 bg-blue-950/60 hover:bg-blue-900/80 text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0"
              title="Cambiar usuario o rol de acceso"
              aria-label="Cambiar usuario activo"
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold bg-white/20 shrink-0">
                {isOwner ? '👑' : '🚚'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white truncate max-w-[100px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-blue-200 uppercase tracking-wider font-extrabold -mt-0.5">
                  {currentUser.role === 'propietario' ? 'ADMINISTRADOR' : 'CHOFER'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-70 hidden sm:block" />
            </button>

            {/* Quick Action (Available for both Owners and Drivers) */}
            <button
              onClick={onOpenQuickAction}
              className="flex items-center justify-center gap-1 p-1.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm shadow-blue-950/40 shrink-0"
              title={isOwner ? 'Carga Rápida de Operaciones' : 'Registrar Combustible o Siniestro'}
              aria-label="Carga rápida de operaciones"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isOwner ? 'Carga Rápida' : 'Registrar'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900/50 transition cursor-pointer shrink-0"
              title="Centro de alertas y vencimientos"
              aria-label="Ver notificaciones y vencimientos"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] sm:text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Demo Reset (Desktop only) */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-900/40 transition cursor-pointer hidden md:block shrink-0"
              title="Restaurar datos demo de flota"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* User Switcher Modal */}
      {showUserModal && (
        <UserSwitcherModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
        />
      )}

      {/* Confirm Reset Demo Modal */}
      {showResetConfirm && (
        <ConfirmDeleteModal
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={() => {
            resetToDemoData();
            setShowResetConfirm(false);
          }}
          title="¿Restaurar datos demo de flota?"
          itemName="Base de Datos de Demostración"
          itemSubtitle="10 vehículos, conductores asignados, talleres, mantenimientos y pólizas"
          warningDetails={[
            'Se reiniciarán las unidades de flota a su estado inicial.',
            'Se reestablecerán las asignaciones originales de choferes.',
          ]}
          confirmButtonText="Sí, restaurar datos"
        />
      )}
    </>
  );
};
