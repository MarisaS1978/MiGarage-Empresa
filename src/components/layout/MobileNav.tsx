import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Home,
  Truck,
  Users,
  Menu,
  X,
  Wrench,
  FileText,
  Shield,
  Coins,
  Settings,
  Fuel,
  BarChart3,
  Store,
  AlertTriangle,
  Lock,
  LogOut,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    vehicles,
    incidents,
    currentUser,
    isOwner,
    openOwnerLoginModal,
    logoutOwner,
  } = useGarage();
  const [showDrawer, setShowDrawer] = useState(false);

  const activeIncidentsCount = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setShowDrawer(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <>
      {/* Bottom Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-in fade-in">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setShowDrawer(false)}
          />
          <div className="relative bg-[#172554] border-t border-blue-900 rounded-t-3xl p-5 pb-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto text-white">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60 mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-base text-white">Menú de Flota</h3>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-blue-200 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Owner Mode Switcher */}
            <div className="mb-4">
              {!isOwner ? (
                <button
                  onClick={() => {
                    setShowDrawer(false);
                    openOwnerLoginModal(
                      'Ingresá tu contraseña de Administrador para desbloquear el panel completo.'
                    );
                  }}
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Ingresar a Modo Administrador</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    logoutOwner();
                    setShowDrawer(false);
                  }}
                  className="w-full py-2 px-3.5 rounded-2xl bg-white/10 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-300" />
                  <span>Cerrar Sesión Administrador (Salir a Chofer)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'mantenimiento', label: 'Mantenimiento', icon: Wrench },
                { id: 'talleres', label: 'Talleres', icon: Store },
                { id: 'combustible', label: 'Combustible', icon: Fuel },
                { id: 'gastos', label: 'Gastos', icon: Coins },
                { id: 'seguros', label: 'Seguros', icon: Shield },
                { id: 'documentos', label: 'Documentos', icon: FileText },
                { id: 'siniestros', label: 'Siniestros', icon: AlertTriangle },
                { id: 'informes', label: 'Informes & KPIs', icon: BarChart3 },
                { id: 'configuracion', label: 'Configuración', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-2xl border text-left text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#2563EB] text-white border-blue-400 shadow-md shadow-blue-950/40'
                        : 'bg-slate-850 hover:bg-slate-800 bg-[#1e293b] border-slate-700/80 text-slate-100 hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-blue-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#172554] border-t border-blue-900/80 px-2 py-2 flex items-center justify-around text-[10px] font-semibold text-blue-200 shadow-xl">
        <button
          onClick={() => {
            setCurrentTab('inicio');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            currentTab === 'inicio' ? 'text-white font-bold bg-[#2563EB]/40' : 'hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('flota');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            currentTab === 'flota' ? 'text-white font-bold bg-[#2563EB]/40' : 'hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Flota ({vehicles.length})</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('conductores');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            currentTab === 'conductores'
              ? 'text-white font-bold bg-[#2563EB]/40'
              : 'hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Choferes</span>
        </button>

        <button
          onClick={() => setShowDrawer(true)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            showDrawer ? 'text-white font-bold bg-[#2563EB]/40' : 'hover:text-white'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Más</span>
        </button>
      </nav>
    </>
  );
};
