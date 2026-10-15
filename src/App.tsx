import React, { useState, useEffect } from 'react';
import { GarageProvider, useGarage } from './context/GarageContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { VehicleDetailModal } from './components/enterprise/VehicleDetailModal';
import { VehicleFormModal } from './components/common/VehicleFormModal';
import { QuickLogModal } from './components/common/QuickLogModal';
import { NotificationCenterModal } from './components/notifications/NotificationCenterModal';
import { OwnerLoginModal } from './components/common/OwnerLoginModal';
import { ShareInsuranceModal } from './components/enterprise/ShareInsuranceModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

// Enterprise Views
import { EnterpriseDashboard } from './components/enterprise/EnterpriseDashboard';
import { FleetView } from './components/enterprise/FleetView';
import { DriversView } from './components/enterprise/DriversView';
import { EnterpriseMaintenanceView } from './components/enterprise/EnterpriseMaintenanceView';
import { WorkshopsView } from './components/enterprise/WorkshopsView';
import { ExpensesFuelView } from './components/enterprise/ExpensesFuelView';
import { InsuranceView } from './components/enterprise/InsuranceView';
import { DocumentsView } from './components/enterprise/DocumentsView';
import { IncidentsView } from './components/enterprise/IncidentsView';
import { ReportsView } from './components/enterprise/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const {
    currentTab,
    selectedVehicleId,
    setSelectedVehicleId,
    isOwner,
    showOwnerLoginModal,
    setShowOwnerLoginModal,
    ownerLoginReason,
    shareInsuranceVehicleId,
    closeShareInsurance,
  } = useGarage();

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [quickActionType, setQuickActionType] = useState<
    'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro' | 'vehiculo' | null
  >(null);

  // 1. Al presionar Enter en cualquier campo de texto/búsqueda, ocultar teclado móvil
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active instanceof HTMLInputElement) {
          active.blur();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // 3. Al cambiar de pestaña o categoría en 'Más' y el resto de la app, resetear scroll al tope
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [currentTab]);

  const handleOpenQuickAction = (
    type: 'mantenimiento' | 'combustible' | 'recordatorio' | 'siniestro' | 'vehiculo' = 'mantenimiento'
  ) => {
    if (type === 'vehiculo') {
      setShowVehicleModal(true);
    } else {
      setQuickActionType(type);
    }
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'inicio':
        return (
          <EnterpriseDashboard
            onOpenNotifications={() => setShowNotificationCenter(true)}
          />
        );
      case 'flota':
        return (
          <FleetView
            onOpenVehicleModal={() => setShowVehicleModal(true)}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
          />
        );
      case 'conductores':
        return <DriversView />;
      case 'mantenimiento':
        return (
          <EnterpriseMaintenanceView
            onOpenQuickAction={() => handleOpenQuickAction('mantenimiento')}
          />
        );
      case 'talleres':
        return <WorkshopsView />;
      case 'combustible':
      case 'gastos':
        return <ExpensesFuelView />;
      case 'seguros':
        return <InsuranceView />;
      case 'documentos':
        return <DocumentsView />;
      case 'siniestros':
        return <IncidentsView onOpenQuickAction={() => handleOpenQuickAction('siniestro')} />;
      case 'informes':
        return <ReportsView />;
      case 'configuracion':
        return <SettingsView />;
      default:
        return <EnterpriseDashboard onOpenNotifications={() => setShowNotificationCenter(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6FA] text-[#1E293B] flex flex-col antialiased selection:bg-[#2563EB] selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Top Header */}
      <Header
        onOpenQuickAction={() => handleOpenQuickAction(isOwner ? 'mantenimiento' : 'combustible')}
        onOpenNotifications={() => setShowNotificationCenter(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Content Area */}
        <main className="flex-1 px-3 py-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 overflow-x-hidden min-w-0 w-full max-w-full flex flex-col justify-between">
          <div className="flex-1">
            {renderActiveView()}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 pb-2 border-t border-[#DCE3ED] text-center shrink-0">
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-xs font-semibold text-slate-700">
                Desarrollado bajo idea de <span className="font-extrabold text-[#172554]">Marisa Sandroni</span>
              </p>
              <p className="text-[11px] text-[#64748B]">
                MiGarage &copy; {new Date().getFullYear()} &middot; Gestión Integral de Flotas y Choferes
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Notification Center Modal */}
      {showNotificationCenter && (
        <NotificationCenterModal onClose={() => setShowNotificationCenter(false)} />
      )}

      {/* Vehicle Ficha Detail Modal */}
      {selectedVehicleId && (
        <VehicleDetailModal
          vehicleId={selectedVehicleId}
          onClose={() => setSelectedVehicleId(null)}
          onOpenQuickAction={(action) => handleOpenQuickAction(action)}
        />
      )}

      {/* Vehicle Creation / Form Modal */}
      {showVehicleModal && (
        <VehicleFormModal onClose={() => setShowVehicleModal(false)} />
      )}

      {/* Quick Log Modal */}
      {quickActionType && (
        <QuickLogModal
          initialAction={quickActionType}
          onClose={() => setQuickActionType(null)}
        />
      )}

      {/* Owner Authentication Modal */}
      {showOwnerLoginModal && (
        <OwnerLoginModal
          isOpen={showOwnerLoginModal}
          onClose={() => setShowOwnerLoginModal(false)}
          reason={ownerLoginReason}
        />
      )}

      {/* Share Insurance & Accident Assistance Modal */}
      {shareInsuranceVehicleId && (
        <ShareInsuranceModal
          vehicleId={shareInsuranceVehicleId}
          onClose={closeShareInsurance}
          onOpenReportIncident={(vehId) => {
            handleOpenQuickAction('siniestro');
          }}
        />
      )}
      {/* Offline Connectivity Notification */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <GarageProvider>
      <MainAppContent />
    </GarageProvider>
  );
}
