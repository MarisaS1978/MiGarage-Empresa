import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Settings,
  Shield,
  CheckCircle2,
  Lock,
  Download,
  RefreshCw,
  Bell,
  Volume2,
  Users,
  Truck,
  FileSpreadsheet,
} from 'lucide-react';
import { UserSwitcherModal } from '../common/UserSwitcherModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    isOwner,
    vehicles,
    drivers,
    workshops,
    expenses,
    maintenance,
    resetToDemoData,
    notificationSettings,
    updateNotificationSettings,
    requestNotificationPermission,
    sendTestNotification,
    showToast,
  } = useGarage();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExportJSON = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      app: 'MiGarage Empresa',
      currentUser: currentUser.name,
      vehicles,
      drivers,
      workshops,
      maintenance,
      expenses,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `MiGarage_Empresa_Backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Copia de respaldo JSON descargada correctamente');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
          Configuración Corporativa
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          Control de acceso, roles y permisos, notificaciones preventivas y copias de seguridad de la flota.
        </p>
      </div>

      {/* Current User & Role Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold text-[#64748B]">Sesión y Perfil Activo</div>
            <div className="flex items-center gap-2.5 mt-1">
              <h2 className="text-lg font-extrabold text-[#172554]">{currentUser.name}</h2>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  isOwner ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {isOwner ? '👑 Propietario' : '🚚 Chofer'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.title || currentUser.email}</p>
          </div>

          <button
            onClick={() => setShowUserModal(true)}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Cambiar Usuario / Rol
          </button>
        </div>

        {/* Roles and Security Explanation */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 font-bold text-xs text-[#172554]">
            <Shield className="w-4 h-4 text-[#2563EB]" />
            <span>Matriz de Roles y Permisos de la Empresa</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] space-y-2">
              <div className="font-bold text-[#172554] flex items-center gap-1.5">
                <span>👑 Rol Propietario</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded font-bold">
                  Acceso Total
                </span>
              </div>
              <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                <li>Crear, editar y eliminar vehículos</li>
                <li>Crear, editar y eliminar conductores</li>
                <li>Asignar y desasignar choferes</li>
                <li>Gestionar gastos, combustible y mantenimientos</li>
                <li>Administrar talleres, seguros y siniestros</li>
                <li>Generar informes y exportaciones ejecutivas</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] space-y-2">
              <div className="font-bold text-[#172554] flex items-center gap-1.5">
                <span>🚚 Rol Chofer</span>
                <span className="text-[10px] text-blue-800 bg-blue-100 px-2 py-0.2 rounded font-bold">
                  Acceso Restringido
                </span>
              </div>
              <ul className="text-slate-600 space-y-1 list-disc list-inside text-[11px]">
                <li>Consulta de unidades y estado de flota</li>
                <li>
                  <strong className="text-slate-800">
                    Cambiar chofer asignado en el desplegable de unidades (Autorizado)
                  </strong>
                </li>
                <li>Bloqueo de creación, edición y borrado de flota</li>
                <li>Bloqueo de finanzas y datos confidenciales</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#172554]">
            Alertas Preventivas de Flota
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configuración de notificaciones para vencimientos de VTV, seguros, R.U.T.A. y licencias de conducir.
          </p>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F3F6FA] cursor-pointer">
            <span className="font-semibold text-slate-800">Alertas de Vencimiento de Seguros</span>
            <input
              type="checkbox"
              checked={notificationSettings.notifyInsurance}
              onChange={(e) =>
                updateNotificationSettings({ notifyInsurance: e.target.checked })
              }
              className="accent-[#2563EB] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F3F6FA] cursor-pointer">
            <span className="font-semibold text-slate-800">Alertas de VTV y R.U.T.A.</span>
            <input
              type="checkbox"
              checked={notificationSettings.notifyVtv}
              onChange={(e) => updateNotificationSettings({ notifyVtv: e.target.checked })}
              className="accent-[#2563EB] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F3F6FA] cursor-pointer">
            <span className="font-semibold text-slate-800">
              Alertas de Licencias Profesionales de Choferes
            </span>
            <input
              type="checkbox"
              checked={notificationSettings.notifyDriverLicenses}
              onChange={(e) =>
                updateNotificationSettings({ notifyDriverLicenses: e.target.checked })
              }
              className="accent-[#2563EB] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-[#F3F6FA] cursor-pointer">
            <span className="font-semibold text-slate-800">Alerta de Services por Kilometraje</span>
            <input
              type="checkbox"
              checked={notificationSettings.notifyMaintenance}
              onChange={(e) =>
                updateNotificationSettings({ notifyMaintenance: e.target.checked })
              }
              className="accent-[#2563EB] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 rounded-xl border border-[#DCE3ED] hover:bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            Activar Notificaciones Web
          </button>
          <button
            onClick={sendTestNotification}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            Emitir Alerta de Prueba
          </button>
        </div>
      </div>

      {/* Backup and Data Maintenance */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#172554]">Copias de Seguridad y Auditoría</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Exportá los registros de la flota en formato estándar para archivo contable o técnico.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Descargar Copia JSON</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restaurar Datos Demo</span>
          </button>
        </div>
      </div>

      {showUserModal && (
        <UserSwitcherModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
        />
      )}

      {/* Confirm Reset Modal */}
      {showResetConfirm && (
        <ConfirmDeleteModal
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={() => {
            resetToDemoData();
            setShowResetConfirm(false);
          }}
          title="¿Restaurar datos demo de la flota?"
          itemName="Base de Datos Completa de MiGarage Empresa"
          itemSubtitle="10 vehículos comerciales, choferes profesionales, historial y pólizas"
          warningDetails={[
            'Se reiniciarán los datos locales a los valores de demostración de flota.',
            'Se preservará la persistencia en tu navegador.',
          ]}
          confirmButtonText="Sí, restaurar datos"
        />
      )}
    </div>
  );
};
