import React from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Home,
  Truck,
  Users,
  Wrench,
  Fuel,
  Coins,
  Shield,
  FileText,
  AlertTriangle,
  BarChart3,
  Settings,
  Building,
  Store,
  Lock,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    vehicles,
    drivers,
    workshops,
    incidents,
    unreadAlertsCount,
    currentUser,
    isOwner,
    openOwnerLoginModal,
    logoutOwner,
  } = useGarage();

  const activeIncidentsCount = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;

  const navItems = [
    { id: 'inicio', label: 'Dashboard Flota', icon: Home },
    {
      id: 'flota',
      label: 'Flota de Vehículos',
      icon: Truck,
      badge: vehicles.length,
    },
    {
      id: 'conductores',
      label: 'Conductores',
      icon: Users,
      badge: drivers.length,
    },
    { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
    {
      id: 'talleres',
      label: 'Talleres & Proveedores',
      icon: Store,
      badge: workshops.length,
    },
    { id: 'combustible', label: 'Combustible', icon: Fuel },
    { id: 'gastos', label: 'Gastos Operativos', icon: Coins },
    { id: 'seguros', label: 'Seguros Corporativos', icon: Shield },
    { id: 'documentos', label: 'Documentación & RUTA', icon: FileText },
    {
      id: 'siniestros',
      label: 'Siniestros',
      icon: AlertTriangle,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    { id: 'informes', label: 'Informes & KPIs', icon: BarChart3 },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#172554] border-r border-blue-900/60 text-blue-100 min-h-[calc(100vh-4rem)] p-4 select-none">
      {/* Role & Mode Banner */}
      <div className="mb-2.5 px-3.5 py-3 rounded-2xl bg-blue-950/70 border border-blue-800/60 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#2563EB]" />
          <span>Gestión de Flota</span>
        </div>
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
            isOwner
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-blue-500/20 text-blue-200 border border-blue-400/40'
          }`}
        >
          {isOwner ? '👑 Propietario' : '🚚 Chofer'}
        </span>
      </div>

      {/* Mode Switcher Action Button */}
      {!isOwner ? (
        <button
          onClick={() =>
            openOwnerLoginModal(
              'Ingresá la contraseña para acceder a las funciones avanzadas de Propietario.'
            )
          }
          className="w-full mb-3 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          title="Desbloquear Modo Propietario con clave"
        >
          <Lock className="w-3.5 h-3.5 text-amber-300" />
          <span>Ingresar como Propietario</span>
        </button>
      ) : (
        <button
          onClick={logoutOwner}
          className="w-full mb-3 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-200 border border-white/10 text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
          title="Volver a Modo Chofer"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-300" />
          <span>Salir a Modo Chofer</span>
        </button>
      )}

      {/* Navigation List */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white font-semibold shadow-md shadow-blue-950/40'
                  : 'text-blue-100/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-[#DBEAFE]'
                  }`}
                />
                <span className="text-xs">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.2 rounded-full border ${
                    item.badgeColor ||
                    (isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-blue-900/80 text-blue-200 border-blue-800')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="pt-4 border-t border-blue-900/40 text-[11px] text-blue-300/80 flex items-center justify-between">
        <span>Flota activa: {vehicles.length} unidades</span>
        <span className="font-mono text-[10px]">v2.1</span>
      </div>
    </aside>
  );
};
