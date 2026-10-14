import React, { useState, useRef, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { ExpirationAlert, ExpirationAlertType } from '../../types';
import {
  Bell,
  X,
  Shield,
  FileText,
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  ExternalLink,
  Volume2,
  VolumeX,
  Smartphone,
  RefreshCw,
  Sparkles,
  Settings,
  Sliders,
} from 'lucide-react';

interface NotificationCenterModalProps {
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ onClose }) => {
  const {
    alerts,
    unreadAlertsCount,
    notificationSettings,
    updateNotificationSettings,
    markAlertAsRead,
    markAllAlertsAsRead,
    requestNotificationPermission,
    sendTestNotification,
    checkUpcomingExpirationsNow,
    setCurrentTab,
    showToast,
  } = useGarage();

  const [activeFilter, setActiveFilter] = useState<'todas' | ExpirationAlertType>('todas');
  const [showConfig, setShowConfig] = useState(false);
  const alertsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    alertsListRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeFilter]);

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === 'todas') return true;
    return alert.type === activeFilter;
  });

  const handleGoToSection = (alert: ExpirationAlert) => {
    if (alert.actionTab) {
      setCurrentTab(alert.actionTab);
      markAlertAsRead(alert.id);
      onClose();
    }
  };

  const handleShareAlert = (alert: ExpirationAlert) => {
    const text = encodeURIComponent(
      `🔔 *Alerta de Vencimiento MiGarage*\n🚗 *${alert.vehicleName}*\n📌 *${alert.title}*\n⏱️ *${alert.detail}*\n\nVerificado en MiGarage: https://migarage.app`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    showToast('Abriendo WhatsApp...');
  };

  const getUrgencyConfig = (urgency: ExpirationAlert['urgency']) => {
    switch (urgency) {
      case 'critico':
        return {
          label: 'Vencimiento Crítico',
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          badge: 'bg-rose-600 text-white',
          dot: 'bg-rose-500',
        };
      case 'urgente':
        return {
          label: 'Próximo a Vencer (< 15 días)',
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badge: 'bg-amber-600 text-white',
          dot: 'bg-amber-500',
        };
      case 'aviso':
        return {
          label: 'Aviso Preventivo (< 35 días)',
          bg: 'bg-blue-50/70 border-blue-200 text-blue-900',
          badge: 'bg-[#2563EB] text-white',
          dot: 'bg-[#2563EB]',
        };
      default:
        return {
          label: 'Al día',
          bg: 'bg-slate-50 border-slate-200 text-slate-800',
          badge: 'bg-slate-600 text-white',
          dot: 'bg-slate-400',
        };
    }
  };

  const getCategoryIcon = (type: ExpirationAlertType) => {
    switch (type) {
      case 'seguro':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'vtv':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'mantenimiento':
        return <Wrench className="w-4 h-4 text-teal-600" />;
      case 'licencia':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header - Ultra Slim & Clean */}
        <div className="bg-slate-900 text-white px-3.5 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                Centro de Notificaciones & Vencimientos
              </h2>
              {unreadAlertsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-extrabold font-mono shrink-0">
                  {unreadAlertsCount}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shrink-0 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Notification Status Strip */}
        <div className="bg-slate-100 px-3 py-1.5 sm:px-5 sm:py-2 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0 text-[11px] text-slate-700 truncate">
              <Smartphone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="truncate font-medium">
                {notificationSettings.permissionStatus === 'granted'
                  ? 'Alertas Web Push activas'
                  : 'Alertas en dispositivo'}
              </span>
              {notificationSettings.permissionStatus !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="ml-1 text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  Activar
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => checkUpcomingExpirationsNow(true)}
                className="p-1 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                title="Escanear vencimientos ahora"
              >
                <RefreshCw className="w-3 h-3" />
              </button>

              <button
                onClick={() => setShowConfig(!showConfig)}
                className={`p-1 rounded border transition cursor-pointer ${
                  showConfig
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Ajustar preferencias de alerta"
              >
                <Sliders className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Preferences Drawer */}
          {showConfig && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notifyInsurance}
                  onChange={(e) =>
                    updateNotificationSettings({ notifyInsurance: e.target.checked })
                  }
                  className="rounded accent-[#2563EB]"
                />
                <span className="font-semibold text-[10px]">Seguros (30 días)</span>
              </label>

              <label className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notifyVtv}
                  onChange={(e) => updateNotificationSettings({ notifyVtv: e.target.checked })}
                  className="rounded accent-[#2563EB]"
                />
                <span className="font-semibold text-[10px]">VTV & Obleas</span>
              </label>

              <label className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.soundEnabled}
                  onChange={(e) => updateNotificationSettings({ soundEnabled: e.target.checked })}
                  className="rounded accent-[#2563EB]"
                />
                <span className="font-semibold text-[10px]">Sonido de alerta</span>
              </label>
            </div>
          )}
        </div>

        {/* Filter Pills & Actions */}
        <div className="px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-2 overflow-x-auto border-b border-slate-100 bg-white shrink-0 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('todas')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ${
                activeFilter === 'todas'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todas ({alerts.length})
            </button>
            <button
              onClick={() => setActiveFilter('mantenimiento')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0 ${
                activeFilter === 'mantenimiento'
                  ? 'bg-teal-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-teal-500 group-hover:text-teal-700" />
              <span>Services ({alerts.filter((a) => a.type === 'mantenimiento').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('seguro')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0 ${
                activeFilter === 'seguro'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Seguros ({alerts.filter((a) => a.type === 'seguro').length})</span>
            </button>
            <button
              onClick={() => setActiveFilter('vtv')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0 ${
                activeFilter === 'vtv'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>VTV ({alerts.filter((a) => a.type === 'vtv').length})</span>
            </button>
          </div>

          {unreadAlertsCount > 0 && (
            <button
              onClick={markAllAlertsAsRead}
              className="text-xs text-teal-700 hover:text-teal-900 font-bold whitespace-nowrap cursor-pointer shrink-0 ml-2"
            >
              Marcar leídas
            </button>
          )}
        </div>

        {/* Alerts Content List */}
        <div ref={alertsListRef} className="p-3.5 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                ¡Todo al día en tu garage!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                No hay vencimientos de seguros, VTV ni services pendientes en esta categoría.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const urgencyConfig = getUrgencyConfig(alert.urgency);

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-2xl p-3.5 sm:p-4 border transition-all duration-200 shadow-xs space-y-3 overflow-hidden ${
                    !alert.read
                      ? 'border-slate-300 ring-1 ring-teal-500/30'
                      : 'border-slate-200 opacity-90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {getCategoryIcon(alert.type)}
                      </div>
                      <span className="font-bold text-xs text-slate-900 font-mono">
                        {alert.vehicleName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${urgencyConfig.badge}`}
                      >
                        {urgencyConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {alert.daysRemaining !== undefined && (
                        <span className="font-bold font-mono text-slate-700">
                          {alert.daysRemaining <= 0
                            ? 'Vencido'
                            : `Vence en ${alert.daysRemaining} días`}
                        </span>
                      )}
                      {alert.kmRemaining !== undefined && (
                        <span className="font-mono text-slate-700">
                          (Faltan ~{alert.kmRemaining.toLocaleString('es-AR')} km)
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {alert.detail}
                    </p>
                  </div>

                  {/* Actions per alert */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleGoToSection(alert)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 text-xs ${
                          alert.type === 'mantenimiento'
                            ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-xs'
                            : alert.type === 'seguro'
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {alert.type === 'mantenimiento'
                            ? '🛠️ Gestionar Servicio'
                            : alert.type === 'seguro'
                            ? '🛡️ Ver Seguro'
                            : '📄 Ver Documento / VTV'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleShareAlert(alert)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer flex items-center gap-1.5 text-xs shrink-0"
                        title="Enviar recordatorio por WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Compartir</span>
                      </button>
                    </div>

                    {!alert.read && (
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-medium text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0 shadow-2xs"
                        title="Marcar como leída y descartar de pendientes"
                      >
                        <X className="w-3.5 h-3.5 text-slate-400" />
                        <span>Descartar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Sistema inteligente de alertas tempranas MiGarage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
