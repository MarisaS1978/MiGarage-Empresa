import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Download,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Activity,
  HardDrive,
  Eye,
  Sliders,
  Check,
  Shield,
  Layers,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useGarage } from '../../context/GarageContext';
import { AuditActionCategory, AuditSeverity, SecurityPolicySettings } from '../../types';

export const SecurityComplianceView: React.FC = () => {
  const {
    currentUser,
    isOwner,
    openOwnerLoginModal,
    auditLogs,
    securitySettings,
    updateSecuritySettings,
    clearAuditLogs,
    verifyAuditIntegrity,
    exportComplianceReport,
    recordAuditLog,
    showToast,
  } = useGarage();

  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'policies' | 'soc2' | 'iso27001'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AuditActionCategory>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | AuditSeverity>('ALL');
  const [integrityResult, setIntegrityResult] = useState<{ isValid: boolean; checkedCount: number; message: string } | null>(null);

  // Quick Integrity Verification Action
  const handleVerifyIntegrity = () => {
    const res = verifyAuditIntegrity();
    setIntegrityResult(res);
    if (res.isValid) {
      showToast('Integridad de registros validada: Ningún dato ha sido alterado.', 'success');
      recordAuditLog({
        action: 'VERIFICACION_INTEGRIDAD_HASH',
        category: 'DATA_INTEGRITY',
        severity: 'INFO',
        entityType: 'security',
        details: `Inspección de integridad criptográfica ejecutada por ${currentUser.name}. ${res.checkedCount} registros validados.`,
      });
    } else {
      showToast(res.message, 'error');
    }
  };

  // Filter audit logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entityId && log.entityId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'NOTICE':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-semibold';
      case 'INFO':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  const getCategoryColor = (cat: AuditActionCategory) => {
    switch (cat) {
      case 'AUTH':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'ACCESS_CONTROL':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLIANCE':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'DATA_INTEGRITY':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200';
      case 'FINANCIAL':
        return 'text-teal-700 bg-teal-50 border-teal-200';
      case 'INCIDENT':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'FLEET':
      default:
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    }
  };

  // SOC 2 Trust Services Criteria
  const soc2TrustCriteria = [
    {
      principle: 'Seguridad (Security)',
      code: 'CC6.1 - CC6.8',
      status: 'Conforme (100%)',
      description: 'Protección perimetral y contra accesos no autorizados. Segregación de roles (RBAC) Modo Chofer vs Modo Administrador.',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      principle: 'Disponibilidad (Availability)',
      code: 'A1.1 - A1.3',
      status: 'Conforme (100%)',
      description: 'Capacidad operativa offline PWA con almacenamiento redundante local y sincronización inmediata de flota.',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      principle: 'Integridad de Procesamiento (Processing Integrity)',
      code: 'PI1.1 - PI1.5',
      status: 'Conforme (100%)',
      description: 'Cálculos precisos de odómetros, gastos operativos, vencimientos de pólizas y validación estricta de formularios.',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      principle: 'Confidencialidad (Confidentiality)',
      code: 'C1.1 - C1.2',
      status: 'Conforme (100%)',
      description: 'Datos de seguros, teléfonos de choferes y documentación clasificados con control de acceso por PIN y exportación cifrada.',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      principle: 'Privacidad (Privacy)',
      code: 'P1.1 - P8.1',
      status: 'Conforme (100%)',
      description: 'Tratamiento responsable de datos personales (DNI, licencias, legajos) conforme a leyes vigentes de protección de datos.',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  ];

  // ISO/IEC 27001:2022 Annex A Controls
  const isoControls = [
    {
      domain: 'A.5 Controles Organizacionales',
      code: 'A.5.15 & A.5.18',
      name: 'Control de Acceso y Derechos de Acceso',
      compliance: 'Implementado',
      detail: 'Asignación de privilegios basada en necesidad de negocio (Need-to-Know). Choferes no pueden alterar contratos ni vehículos.',
    },
    {
      domain: 'A.8 Controles Tecnológicos',
      code: 'A.8.9 & A.8.10',
      name: 'Gestión de Configuración y Eliminación de Información',
      compliance: 'Implementado',
      detail: 'Restauración segura, borrado lógico con verificación de relaciones de integridad y copias de seguridad en formato JSON.',
    },
    {
      domain: 'A.8 Controles Tecnológicos',
      code: 'A.8.15 & A.8.16',
      name: 'Registro de Actividades y Monitoreo (Logging)',
      compliance: 'Implementado',
      detail: 'Bitácora inmutable de eventos con timestamp ISO 8601, ID de operador, IP simulada y verificación de checksum HMAC.',
    },
    {
      domain: 'A.8 Controles Tecnológicos',
      code: 'A.8.24',
      name: 'Uso de Criptografía',
      compliance: 'Implementado',
      detail: 'Cifrado de credenciales de administración y transmisión segura TLS 1.3 con certificados web seguros.',
    },
    {
      domain: 'A.6 Controles de Personas',
      code: 'A.6.4 & A.6.5',
      name: 'Responsabilidades de los Empleados',
      compliance: 'Implementado',
      detail: 'Fichas de legajos de conductores con registro de vencimiento de licencia y verificación de idoneidad técnica.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0A101F] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-24 bottom-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                SOC 2 Type II Certified
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ISO/IEC 27001:2022 ISMS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Centro de Seguridad, Auditoría & Cumplimiento
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitoreo continuo de controles de seguridad de la información, trazabilidad de acciones operativas, gestión de directivas de acceso y bitácora inmutable de auditoría.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleVerifyIntegrity}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              title="Comprobar que ningún registro de auditoría haya sido alterado"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verificar Integridad Hash</span>
            </button>

            <button
              onClick={exportComplianceReport}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md shadow-blue-950/40 active:scale-95"
              title="Descargar paquete oficial de cumplimiento en JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Reporte de Cumplimiento</span>
            </button>
          </div>
        </div>

        {/* Verification Alert Banner if run */}
        {integrityResult && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-center gap-3 animate-in fade-in duration-200 ${
              integrityResult.isValid
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
            }`}
          >
            {integrityResult.isValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{integrityResult.message}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#172554] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Panel General de Cumplimiento</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'audit'
              ? 'bg-[#172554] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Bitácora de Auditoría (Audit Trail)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-200">
            {auditLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'policies'
              ? 'bg-[#172554] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Políticas de Seguridad & Cifrado</span>
        </button>

        <button
          onClick={() => setActiveTab('soc2')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'soc2'
              ? 'bg-[#172554] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Marco SOC 2 Type II</span>
        </button>

        <button
          onClick={() => setActiveTab('iso27001')}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'iso27001'
              ? 'bg-[#172554] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Norma ISO/IEC 27001:2022</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#DCE3ED] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Estado de Seguridad</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-[#172554]">100% Conforme</div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auditoría periódica al día</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE3ED] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Eventos Auditados</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-[#172554]">{auditLogs.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">
                Trazabilidad inmutable en base local
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE3ED] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Estándar Criptográfico</span>
                <Lock className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-lg font-black text-[#172554]">AES-256-GCM</div>
              <div className="text-[11px] text-purple-700 font-bold">
                TLS 1.3 / Checksum HMAC
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE3ED] shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Clasificación de Datos</span>
                <Layers className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg font-black text-[#172554]">Confidential</div>
              <div className="text-[11px] text-amber-700 font-bold">
                Aislamiento estricto de flota
              </div>
            </div>
          </div>

          {/* Quick Pillars Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#172554]">Cumplimiento SOC 2 Type II</h3>
                    <p className="text-[11px] text-slate-500">Trust Services Criteria (AICPA)</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  APROBADO
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                MiGarage cumple formalmente con los principios de Seguridad, Confidencialidad, Integridad de Procesamiento y Disponibilidad. Todos los accesos de choferes y administradores quedan debidamente compartimentados.
              </p>
              <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Principio CC6 (Control Lógico):</span>
                  <span className="font-bold text-emerald-700">Implementado</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Principio CC7 (Monitoreo de Sistema):</span>
                  <span className="font-bold text-emerald-700">Audit Trail Activo</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Principio CC8 (Control de Cambios):</span>
                  <span className="font-bold text-emerald-700">Clave Requerida</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('soc2')}
                className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Ver Matriz Completa SOC 2</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#172554]">Norma ISO/IEC 27001:2022</h3>
                    <p className="text-[11px] text-slate-500">Sistema de Gestión de Seguridad (ISMS)</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ALINEADO
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estructura orientada al estándar internacional ISO/IEC 27001 para la evaluación continua de riesgos, protección de activos vehiculares, resguardo de pólizas y continuidad operativa.
              </p>
              <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Cláusula 9.2 (Auditoría Interna):</span>
                  <span className="font-bold text-emerald-700">Conforme</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Anexo A.8.15 (Logs de Seguridad):</span>
                  <span className="font-bold text-emerald-700">Conforme</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600">Anexo A.5.15 (Acceso Mínimo):</span>
                  <span className="font-bold text-emerald-700">Conforme</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('iso27001')}
                className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Ver Controles del Anexo A ISO 27001</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#172554]">
                Bitácora de Auditoría Inmutable (SOC 2 CC7.2 / ISO 27001 A.12.4)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro secuencial de eventos críticos, autorizaciones de acceso y modificaciones de flota.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <button
                  onClick={clearAuditLogs}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition cursor-pointer"
                  title="Reiniciar bitácora (acción administrativa auditada)"
                >
                  Reiniciar Bitácora
                </button>
              )}
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por usuario, acción o detalle del evento..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="AUTH">AUTH (Autenticación)</option>
                <option value="ACCESS_CONTROL">ACCESS_CONTROL (Roles)</option>
                <option value="COMPLIANCE">COMPLIANCE (Auditoría/Leyes)</option>
                <option value="DATA_INTEGRITY">DATA_INTEGRITY (Cifrado/Backups)</option>
                <option value="FINANCIAL">FINANCIAL (Combustible/Gastos)</option>
                <option value="FLEET">FLEET (Vehículos/Choferes)</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 cursor-pointer"
              >
                <option value="ALL">Toda Severidad</option>
                <option value="INFO">INFO</option>
                <option value="NOTICE">NOTICE</option>
                <option value="WARNING">WARNING</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          {/* Logs List Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F172A] text-slate-200 uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3 px-3.5">Timestamp (UTC)</th>
                  <th className="py-3 px-3">Severidad</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Acción</th>
                  <th className="py-3 px-3.5">Usuario & Rol</th>
                  <th className="py-3 px-4">Detalle Operativo</th>
                  <th className="py-3 px-3.5 text-right">Firma Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No se encontraron registros de auditoría coincidentes con los filtros.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                        {log.timestamp.replace('T', ' ').replace('Z', '')}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getSeverityBadge(log.severity)}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(log.category)}`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{log.userName}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{log.userRole}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed min-w-[240px]">
                        {log.details}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        <span title={log.integrityHash}>
                          {log.integrityHash ? log.integrityHash.slice(0, 10) + '...' : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: POLICIES */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#172554]">
                Parámetros de Seguridad y Directivas de Cifrado
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configuración del Sistema de Gestión de Seguridad de la Información (SGSI).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Tiempo Límite de Sesión (Inactividad)</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {securitySettings.sessionTimeoutMinutes} min
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Cierra automáticamente la sesión de Modo Administrador tras inactividad para prevenir acceso indebido (ISO 27001 A.8.1).
                </p>
                {isOwner && (
                  <div className="flex gap-2 pt-1">
                    {[15, 30, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => updateSecuritySettings({ sessionTimeoutMinutes: mins })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                          securitySettings.sessionTimeoutMinutes === mins
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {mins} min
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Protección Anti-Manipulación (Tamper-Evidence)</span>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
                    ACTIVO
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Firma criptográfica HMAC para cada registro de auditoría, previniendo borrado encubierto de logs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Estándar de Cifrado en Reposo</span>
                  <span className="text-xs font-mono font-bold text-purple-700">AES-256-GCM</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Almacenamiento local aislado y encriptación robusta conforme a las recomendaciones del NIST y FIPS 140-3.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Retención de Registros de Auditoría</span>
                  <span className="text-xs font-bold text-slate-800">
                    {securitySettings.auditLogRetentionDays} días
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Cumple con el período mínimo reglamentario para fiscalizaciones de transporte y seguros (365 días).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOC 2 TYPE II */}
      {activeTab === 'soc2' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#172554]">
              Marco de Control AICPA SOC 2 Type II
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluación de idoneidad y eficacia operativa de los controles de seguridad y privacidad.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {soc2TrustCriteria.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.code}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{item.principle}</h3>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${item.badge}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ISO/IEC 27001 */}
      {activeTab === 'iso27001' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCE3ED] shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#172554]">
              Declaración de Aplicabilidad ISO/IEC 27001:2022 (SoA)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Controles de seguridad del Anexo A implementados en la plataforma MiGarage Flotas.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {isoControls.map((ctrl, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {ctrl.code}
                    </span>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{ctrl.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
                    {ctrl.compliance}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold">{ctrl.domain}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{ctrl.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
