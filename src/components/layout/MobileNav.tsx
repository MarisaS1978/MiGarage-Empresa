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
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab, vehicles, incidents, currentUser } = useGarage();
  const [showDrawer, setShowDrawer] = useState(false);

  const activeIncidentsCount = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setShowDrawer(false);
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
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60 mb-4">
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
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-left text-xs text-white cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#DBEAFE]" />
                    <span className="font-semibold">{item.label}</span>
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
          onClick={() => setCurrentTab('inicio')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            currentTab === 'inicio' ? 'text-white font-bold bg-[#2563EB]/40' : 'hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentTab('flota')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition cursor-pointer ${
            currentTab === 'flota' ? 'text-white font-bold bg-[#2563EB]/40' : 'hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Flota ({vehicles.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('conductores')}
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
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-blue-200 hover:text-white cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Más</span>
        </button>
      </nav>
    </>
  );
};
