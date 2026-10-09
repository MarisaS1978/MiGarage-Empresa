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
} from 'lucide-react';
import { UserSwitcherModal } from '../common/UserSwitcherModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

interface HeaderProps {
  onOpenQuickAction: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAction, onOpenNotifications }) => {
  const { currentUser, isOwner, resetToDemoData, unreadAlertsCount } = useGarage();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#172554] border-b border-blue-900/60 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-900/40 shrink-0">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">MiGarage</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                  Empresa
                </span>
              </div>
              <p className="text-[11px] text-blue-200 hidden xs:block truncate">
                Gestión Integral de Flotas y Choferes
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active User Pill with Role Indicator & Switcher */}
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-400/30 bg-blue-950/60 hover:bg-blue-900/80 text-xs sm:text-sm font-semibold transition cursor-pointer"
              title="Cambiar usuario o rol de acceso"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">
                {isOwner ? '👑' : '🚚'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-blue-200 uppercase tracking-wider font-extrabold -mt-0.5">
                  {currentUser.role}
                </div>
              </div>
              <span className="sm:hidden text-xs font-bold uppercase">{currentUser.role}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Quick Action (Available for both Owners and Drivers) */}
            <button
              onClick={onOpenQuickAction}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm shadow-blue-950/40"
              title={isOwner ? 'Carga Rápida de Operaciones' : 'Registrar Combustible o Siniestro'}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isOwner ? 'Carga Rápida' : 'Registrar'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-blue-200 hover:text-white hover:bg-blue-900/50 transition cursor-pointer"
              title="Centro de alertas y vencimientos"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Demo Reset */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-900/40 transition cursor-pointer hidden md:block"
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
