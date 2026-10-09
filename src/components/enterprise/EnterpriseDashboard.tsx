import React from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  Building2,
  Truck,
  Users,
  Wrench,
  Fuel,
  Coins,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface EnterpriseDashboardProps {
  onOpenNotifications?: () => void;
}

export const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({
  onOpenNotifications,
}) => {
  const {
    vehicles,
    drivers,
    maintenance,
    fuelLogs,
    expenses,
    incidents,
    reminders,
    alerts,
    setCurrentTab,
    unreadAlertsCount,
    isOwner,
  } = useGarage();

  // Dynamic Fleet Counters
  const totalFleet = vehicles.length;
  const availableCount = vehicles.filter((v) => (v.fleetStatus || 'disponible') === 'disponible').length;
  const inUseCount = vehicles.filter((v) => v.fleetStatus === 'en_uso').length;
  const maintenanceCount = vehicles.filter((v) => v.fleetStatus === 'mantenimiento').length;
  const outOfServiceCount = vehicles.filter((v) => v.fleetStatus === 'fuera_de_servicio').length;

  // Drivers assignment counters
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter((d) => d.status === 'activo').length;
  const assignedDriversCount = drivers.filter((d) => !!d.assignedVehicleId).length;

  // Dynamic Financials
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMaintenanceAmount = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const totalFuelAmount = fuelLogs.reduce((sum, f) => sum + f.totalPrice, 0);
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);

  // Dynamic Incident and Alert Counters
  const activeIncidents = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;
  const urgentExpirations = alerts.filter(
    (a) => a.urgency === 'critico' || a.urgency === 'urgente'
  ).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Enterprise Welcome Banner */}
      <div className="bg-[#172554] rounded-3xl p-5 sm:p-7 border border-blue-900/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#DBEAFE] text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Suite Corporativa de Gestión de Flota</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard de Flota
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Control integral de unidades activas, conductores, costos operativos y vencimientos preventivos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('informes')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md shadow-blue-950/40"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Informes & KPIs</span>
          </button>
        </div>
      </div>

      {/* Fleet Status Counters Top Row */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE3ED] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-base font-bold text-[#172554]">Estado de Flota en Tiempo Real</h2>
          </div>
          <div className="text-xs font-semibold text-[#64748B]">
            Flota total: <strong className="text-slate-900 font-mono text-sm">{totalFleet} unidades</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#15803D]">🟢 Disponibles</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono mt-1">
              {availableCount}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium">Listos para servicio</div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2563EB]">🔵 En uso</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-950 font-mono mt-1">
              {inUseCount}
            </div>
            <div className="text-[11px] text-blue-700 mt-1 font-medium">En ruta o despacho</div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700">🟡 Mantenimiento</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono mt-1">
              {maintenanceCount}
            </div>
            <div className="text-[11px] text-amber-700 mt-1 font-medium">Services o preventivos</div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B91C1C]">🔴 Fuera servicio</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono mt-1">
              {outOfServiceCount}
            </div>
            <div className="text-[11px] text-rose-700 mt-1 font-medium">Taller / Reparación</div>
          </div>
        </div>
      </div>

      {/* Financials & Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Gastos */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Coins className="w-4 h-4 text-[#2563EB]" />
            <span>Gastos Totales</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ${totalExpensesAmount.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{expenses.length} registros cargados</div>
        </div>

        {/* Mantenimiento */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Wrench className="w-4 h-4 text-[#2563EB]" />
            <span>Mantenimiento</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ${totalMaintenanceAmount.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{maintenance.length} intervenciones</div>
        </div>

        {/* Combustible */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Fuel className="w-4 h-4 text-[#2563EB]" />
            <span>Combustible</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ${totalFuelAmount.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{totalFuelLiters.toLocaleString('es-AR')} L despachados</div>
        </div>

        {/* Choferes */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Users className="w-4 h-4 text-[#2563EB]" />
            <span>Conductores</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {assignedDriversCount} / {totalDrivers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{activeDrivers} choferes activos</div>
        </div>

        {/* Siniestros & Vencimientos */}
        <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Alertas & Siniestros</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {urgentExpirations + activeIncidents}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {urgentExpirations} vencimientos · {activeIncidents} siniestros
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Alerts & Active Fleet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Next Expirations Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE3ED] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-[#172554] text-sm">Próximos Vencimientos Preventivos</h3>
              </div>
              <button
                onClick={() => setCurrentTab('documentos')}
                className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 4).map((al) => (
                <div
                  key={al.id}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                    al.urgency === 'critico'
                      ? 'bg-rose-50/70 border-rose-200'
                      : al.urgency === 'urgente'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-blue-50/50 border-blue-100'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900">{al.title}</div>
                    <div className="text-[11px] text-slate-600 truncate max-w-xs">{al.detail}</div>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      al.urgency === 'critico'
                        ? 'bg-rose-200 text-rose-900'
                        : al.urgency === 'urgente'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-blue-200 text-blue-900'
                    }`}
                  >
                    {al.daysRemaining !== undefined && al.daysRemaining <= 0
                      ? 'Vencido'
                      : `${al.daysRemaining} días`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Fleet Units Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#DCE3ED] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-bold text-[#172554] text-sm">Resumen de Asignaciones de Flota</h3>
              </div>
              <button
                onClick={() => setCurrentTab('flota')}
                className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Módulo Flota</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {vehicles.slice(0, 4).map((veh) => (
                <div
                  key={veh.id}
                  onClick={() => setCurrentTab('flota')}
                  className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] hover:border-[#2563EB]/40 text-xs flex items-center justify-between gap-3 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#172554] text-white text-[11px]">
                      {veh.plate}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">
                        {veh.brand} {veh.model}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Chofer:{' '}
                        <strong>
                          {veh.assignedDriverName || 'Sin asignar'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      veh.fleetStatus === 'disponible'
                        ? 'bg-emerald-100 text-emerald-800'
                        : veh.fleetStatus === 'en_uso'
                        ? 'bg-blue-100 text-blue-800'
                        : veh.fleetStatus === 'mantenimiento'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {veh.fleetStatus || 'disponible'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
