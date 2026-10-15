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
  KeyRound,
  LogOut,
  Edit,
  Smartphone,
} from 'lucide-react';
import { UserSwitcherModal } from '../common/UserSwitcherModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { EditOwnerModal } from '../common/EditOwnerModal';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    availableUsers,
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
    openOwnerLoginModal,
    logoutOwner,
    changeOwnerPassword,
  } = useGarage();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditOwnerModal, setShowEditOwnerModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const adminUser =
    availableUsers.find((u) => u.role === 'propietario') || {
      name: 'Ing. Roberto Méndez',
      email: 'roberto.mendez@transporte-sa.com',
      title: 'Gerente General de Flota',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showToast('Por favor ingresá una contraseña válida', 'warning');
      return;
    }
    if (newPassword.trim().length < 4) {
      showToast('La contraseña debe tener al menos 4 caracteres', 'warning');
      return;
    }
    changeOwnerPassword(newPassword.trim());
    setNewPassword('');
    setIsChangingPass(false);
  };

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
                {isOwner ? '👑 Administrador' : '🚚 Chofer'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.title || currentUser.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isOwner ? (
              <button
                onClick={() =>
                  openOwnerLoginModal(
                    'Ingresá tu clave de Administrador para desbloquear la gestión completa.'
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>Ingresar a Modo Administrador</span>
              </button>
            ) : (
              <button
                onClick={logoutOwner}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Salir a Modo Chofer</span>
              </button>
            )}

            <button
              onClick={() => setShowUserModal(true)}
              className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Cambiar Usuario / Rol
            </button>
          </div>
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
                <span>👑 Rol Administrador (Modo Administrador)</span>
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
                <li>
                  <strong className="text-blue-700">
                    Registrar cargas de combustible y odómetro de su unidad (Habilitado)
                  </strong>
                </li>
                <li>
                  <strong className="text-amber-800">
                    Denunciar y reportar siniestros o incidentes viales (Habilitado)
                  </strong>
                </li>
                <li>Bloqueo de creación, edición y borrado estructural de flota</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Administrator Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold text-[#64748B] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Titular y Responsable — Modo Administrador</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <img
                src={
                  adminUser.avatarUrl ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
                }
                alt={adminUser.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#172554]">{adminUser.name}</h3>
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full uppercase">
                    👑 Administrador
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{adminUser.title || adminUser.email}</p>
                <p className="text-[11px] text-[#2563EB] font-medium">{adminUser.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!isOwner) {
                  openOwnerLoginModal(
                    'Ingresá en Modo Administrador para modificar los datos del titular de flota.'
                  );
                  return;
                }
                setShowEditOwnerModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Edit className="w-3.5 h-3.5 text-amber-700" />
              <span>Cambiar Propietario / Administrador</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Esta persona posee la autoridad máxima sobre la flota (registro de vehículos, choferes, talleres, contratos y pólizas de seguros). Podés modificar su nombre, email, cargo o asignar a otro miembro en cualquier momento.
        </p>
      </div>

      {/* Security & Owner Password Configuration */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-base font-bold text-[#172554]">
              Seguridad y Clave de Acceso de Modo Administrador
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configuración de credenciales de administración y política de acceso por defecto.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Política de Inicio en Modo Chofer (Activa)</span>
          </div>
          <p className="text-blue-800 leading-relaxed text-[11px]">
            Para evitar modificaciones no deseadas en vehículos, gastos y contratos, la aplicación se inicia por defecto en <strong>Modo Chofer</strong>. Para acceder a la administración general, el usuario debe ingresar la clave de Modo Administrador.
          </p>
        </div>

        {isOwner ? (
          <div className="pt-2 border-t border-slate-100">
            {!isChangingPass ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]">
                <div>
                  <div className="font-bold text-xs text-slate-800">
                    Contraseña de Administración
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    Protegida. Clave demo predeterminada: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-900">admin123</code>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChangingPass(true)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
                >
                  Cambiar Contraseña
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="p-4 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] space-y-3">
                <div className="font-bold text-xs text-slate-800">
                  Definir Nueva Clave de Modo Administrador
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresá la nueva clave (mín. 4 caracteres)"
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Guardar Clave
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPass(false);
                        setNewPassword('');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Estás en <strong>Modo Chofer</strong>. Para modificar la clave de administración, primero debés ingresar en Modo Administrador.
            </span>
            <button
              onClick={() => openOwnerLoginModal('Ingresá en Modo Administrador para gestionar la seguridad.')}
              className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shrink-0 transition"
            >
              Iniciar Sesión
            </button>
          </div>
        )}
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

      {/* PWA & Mobile Home Screen Installation Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0f172a] p-1.5 border border-blue-500/30 shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/pwa-192x192.png"
                alt="Icono MiGarage"
                className="w-full h-full rounded-xl object-contain shadow-xs"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Icono en Celular & PWA
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Acceso Rápido
                </span>
              </div>
              <h2 className="text-base font-bold text-[#172554] mt-1">
                Acceso Directo e Instalación en Celular
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                Guardá el icono oficial de <strong>MiGarage</strong> en la pantalla de inicio de tu teléfono (Android, iPhone o tablet) para ingresar como una aplicación nativa sin barra de direcciones.
              </p>
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <PWAInstallButton variant="full" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <span className="font-bold text-slate-800 block">📱 Icono HD en Pantalla</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
              Icono adaptativo de alta resolución (192px y 512px) optimizado para Android e iOS.
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <span className="font-bold text-slate-800 block">⚡ Modo Standalone</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
              Apertura a pantalla completa sin elementos de navegador, fluida y con carga instantánea.
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <span className="font-bold text-slate-800 block">💾 Respaldo Local</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
              Funciona con datos en caché para consultas en ruta o zonas con baja cobertura celular.
            </span>
          </div>
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

      {/* Edit Owner / Administrator Modal */}
      {showEditOwnerModal && (
        <EditOwnerModal
          isOpen={showEditOwnerModal}
          onClose={() => setShowEditOwnerModal(false)}
        />
      )}
    </div>
  );
};
