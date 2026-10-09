import React, { useState, useEffect } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Driver, Vehicle } from '../../types';
import {
  Building2,
  Truck,
  Users,
  Wrench,
  Fuel,
  Coins,
  AlertTriangle,
  Clock,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Calendar,
  AlertCircle,
  Phone,
  Mail,
  Car,
  ExternalLink,
  Shield,
  FileText,
  UserCheck,
  Edit3,
  PlusCircle,
  User,
} from 'lucide-react';
import { DriverFormModal } from './DriverFormModal';
import { QuickAssignDriverModal } from '../common/QuickAssignDriverModal';
import { FuelModal } from './FuelModal';
import { IncidentModal } from './IncidentModal';

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
    insurance,
    documents,
    alerts,
    setCurrentTab,
    setSelectedVehicleId,
    currentUser,
    isOwner,
    isDriver,
    assignDriverToVehicle,
    showToast,
  } = useGarage();

  // Mode of view: 'general' (fleet overview) or 'driver' (individual driver dashboard)
  const [dashboardMode, setDashboardMode] = useState<'general' | 'driver'>(() => {
    return isDriver ? 'driver' : 'general';
  });

  // Selected driver for driver view
  const [selectedDriverId, setSelectedDriverId] = useState<string>(() => {
    if (isDriver && currentUser.driverId) {
      return currentUser.driverId;
    }
    return drivers[0]?.id || '';
  });

  // Submodals state
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
  const [vehicleToAssign, setVehicleToAssign] = useState<Vehicle | null>(null);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Synchronize when active currentUser changes
  useEffect(() => {
    if (isDriver && currentUser.driverId) {
      setDashboardMode('driver');
      setSelectedDriverId(currentUser.driverId);
    }
  }, [currentUser, isDriver]);

  // Synchronize if selected driver id is no longer in drivers list
  useEffect(() => {
    if (drivers.length > 0 && !drivers.some((d) => d.id === selectedDriverId)) {
      setSelectedDriverId(drivers[0].id);
    }
  }, [drivers, selectedDriverId]);

  // Active driver object
  const activeDriver: Driver | undefined =
    drivers.find((d) => d.id === selectedDriverId) || drivers[0];

  // Assigned vehicle for active driver
  const assignedVehicle: Vehicle | undefined = activeDriver
    ? vehicles.find(
        (v) =>
          v.id === activeDriver.assignedVehicleId ||
          v.assignedDriverId === activeDriver.id
      )
    : undefined;

  // General Fleet Counters
  const totalFleet = vehicles.length;
  const availableCount = vehicles.filter(
    (v) => (v.fleetStatus || 'disponible') === 'disponible'
  ).length;
  const inUseCount = vehicles.filter((v) => v.fleetStatus === 'en_uso').length;
  const maintenanceCount = vehicles.filter(
    (v) => v.fleetStatus === 'mantenimiento'
  ).length;
  const outOfServiceCount = vehicles.filter(
    (v) => v.fleetStatus === 'fuera_de_servicio'
  ).length;

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter((d) => d.status === 'activo').length;
  const assignedDriversCount = drivers.filter(
    (d) => !!d.assignedVehicleId
  ).length;

  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMaintenanceAmount = maintenance.reduce(
    (sum, m) => sum + m.cost,
    0
  );
  const totalFuelAmount = fuelLogs.reduce((sum, f) => sum + f.totalPrice, 0);
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'resuelto' && i.status !== 'rechazado'
  ).length;
  const urgentExpirations = alerts.filter(
    (a) => a.urgency === 'critico' || a.urgency === 'urgente'
  ).length;

  // Calculations for active driver & assigned vehicle
  const driverLicenseDays = activeDriver
    ? Math.ceil(
        (new Date(activeDriver.licenseExpiry).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const vehMaintenance = assignedVehicle
    ? maintenance.filter((m) => m.vehicleId === assignedVehicle.id)
    : [];
  const vehFuelLogs = assignedVehicle
    ? fuelLogs.filter((f) => f.vehicleId === assignedVehicle.id)
    : [];
  const vehFuelSpent = vehFuelLogs.reduce((sum, f) => sum + f.totalPrice, 0);
  const vehFuelLiters = vehFuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const vehIncidents = assignedVehicle
    ? incidents.filter(
        (inc) =>
          inc.vehicleId === assignedVehicle.id ||
          (activeDriver && inc.driverId === activeDriver.id)
      )
    : [];
  const vehInsurance = assignedVehicle
    ? insurance.find((ins) => ins.vehicleId === assignedVehicle.id)
    : undefined;
  const vehAlerts = alerts.filter(
    (al) =>
      (assignedVehicle && al.vehicleId === assignedVehicle.id) ||
      (activeDriver &&
        al.title.toLowerCase().includes(activeDriver.name.toLowerCase()))
  );

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
            Dashboard Operativo
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            {dashboardMode === 'general'
              ? 'Control integral de flota completa, costos consolidados y estado de unidades en tiempo real.'
              : `Panel de control y seguimiento para ${activeDriver ? activeDriver.name : 'el conductor seleccionado'}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('informes')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md shadow-blue-950/40"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Informes & KPIs</span>
          </button>
        </div>
      </div>

      {/* VIEW SELECTOR: Flota General vs. Vista por Chofer */}
      <div className="bg-white rounded-2xl p-3 border border-[#DCE3ED] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">
            Modo de Vista:
          </span>
          <div className="flex p-1 bg-[#F3F6FA] rounded-xl border border-[#DCE3ED]">
            <button
              onClick={() => setDashboardMode('general')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                dashboardMode === 'general'
                  ? 'bg-[#172554] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#172554]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Flota General</span>
            </button>
            <button
              onClick={() => setDashboardMode('driver')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                dashboardMode === 'driver'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#2563EB]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Vista por Chofer</span>
            </button>
          </div>
        </div>

        {/* Driver Dropdown Selector (Active when in Driver view, or to pick driver) */}
        {dashboardMode === 'driver' && drivers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B] hidden md:inline">
              Conductor:
            </span>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="px-3 py-1.5 bg-[#F3F6FA] border border-[#DCE3ED] rounded-xl text-xs font-bold text-[#172554] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] cursor-pointer"
            >
              {drivers.map((drv) => {
                const veh = vehicles.find(
                  (v) =>
                    v.id === drv.assignedVehicleId ||
                    v.assignedDriverId === drv.id
                );
                const dniEnd =
                  drv.dni && drv.dni.length >= 3
                    ? drv.dni.slice(-3)
                    : drv.dni || '---';
                return (
                  <option key={drv.id} value={drv.id}>
                    {drv.name} — DNI terminado en {dniEnd}{' '}
                    {veh ? `(${veh.brand} ${veh.model} · ${veh.plate})` : '(Sin unidad)'}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW A: GENERAL FLEET DASHBOARD
          ========================================================================= */}
      {dashboardMode === 'general' ? (
        <>
          {/* Fleet Status Counters Top Row */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE3ED] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2563EB]" />
                <h2 className="text-base font-bold text-[#172554]">
                  Estado de Flota en Tiempo Real
                </h2>
              </div>
              <div className="text-xs font-semibold text-[#64748B]">
                Flota total:{' '}
                <strong className="text-slate-900 font-mono text-sm">
                  {totalFleet} unidades
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#15803D]">
                    🟢 Disponibles
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono mt-1">
                  {availableCount}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Listos para servicio
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2563EB]">
                    🔵 En uso
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-950 font-mono mt-1">
                  {inUseCount}
                </div>
                <div className="text-[11px] text-blue-700 mt-1 font-medium">
                  En ruta o despacho
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700">
                    🟡 Mantenimiento
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-950 font-mono mt-1">
                  {maintenanceCount}
                </div>
                <div className="text-[11px] text-amber-700 mt-1 font-medium">
                  Services o preventivos
                </div>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B91C1C]">
                    🔴 Fuera servicio
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-950 font-mono mt-1">
                  {outOfServiceCount}
                </div>
                <div className="text-[11px] text-rose-700 mt-1 font-medium">
                  Taller / Reparación
                </div>
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
              <div className="text-[11px] text-slate-500 mt-1">
                {expenses.length} registros cargados
              </div>
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
              <div className="text-[11px] text-slate-500 mt-1">
                {maintenance.length} intervenciones
              </div>
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
              <div className="text-[11px] text-slate-500 mt-1">
                {totalFuelLiters.toLocaleString('es-AR')} L despachados
              </div>
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
              <div className="text-[11px] text-slate-500 mt-1">
                {activeDrivers} choferes activos
              </div>
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

          {/* Drivers Quick Direct Switcher Strip */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE3ED] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-bold text-[#172554] text-sm">
                  Choferes Registrados y Asignaciones
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('conductores')}
                className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Administrar choferes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {drivers.map((d) => {
                const veh = vehicles.find(
                  (v) =>
                    v.id === d.assignedVehicleId || v.assignedDriverId === d.id
                );
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDriverId(d.id);
                      setDashboardMode('driver');
                    }}
                    className="p-3.5 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] hover:border-[#2563EB] hover:bg-[#DBEAFE]/30 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs">
                        {d.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#2563EB]">
                          {d.name}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {veh ? (
                            <span className="font-semibold text-slate-700">
                              🚚 {veh.brand} {veh.model} ({veh.plate})
                            </span>
                          ) : (
                            <span className="text-amber-700">
                              ⚠️ Sin vehículo asignado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5">
                      Ver ficha <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                );
              })}
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
                    <h3 className="font-bold text-[#172554] text-sm">
                      Próximos Vencimientos Preventivos
                    </h3>
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
                        <div className="text-[11px] text-slate-600 truncate max-w-xs">
                          {al.detail}
                        </div>
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
                    <h3 className="font-bold text-[#172554] text-sm">
                      Resumen de Asignaciones de Flota
                    </h3>
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
                      onClick={() => setSelectedVehicleId(veh.id)}
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
        </>
      ) : (
        /* =========================================================================
           VIEW B: INDIVIDUAL DRIVER DASHBOARD VIEW (DATOS DEL CHOFER Y VEHICULO ASIGNADO)
           ========================================================================= */
        activeDriver && (
          <div className="space-y-6">
            {/* Quick Switch Pills between Drivers */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-[#64748B] shrink-0">
                Choferes:
              </span>
              {drivers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDriverId(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                    d.id === activeDriver.id
                      ? 'bg-[#172554] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-[#DCE3ED] hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>{d.name}</span>
                  {d.assignedVehicleId ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              ))}
            </div>

            {/* TWO MAIN CARDS: CHOFER CARD & VEHICULO ASIGNADO CARD */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* 1. DATOS DEL CHOFER */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE3ED] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#DCE3ED]">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-black text-xl shadow-inner">
                        {activeDriver.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-black text-[#172554]">
                            {activeDriver.name}
                          </h2>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              activeDriver.status === 'activo'
                                ? 'bg-emerald-100 text-emerald-800'
                                : activeDriver.status === 'licencia'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {activeDriver.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#64748B] font-mono mt-0.5">
                          DNI: <strong>{activeDriver.dni || 'No registrado'}</strong>
                        </div>
                      </div>
                    </div>

                    {isOwner && (
                      <button
                        onClick={() => setDriverToEdit(activeDriver)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-[#DBEAFE] text-slate-600 hover:text-[#2563EB] transition cursor-pointer text-xs font-semibold flex items-center gap-1"
                        title="Editar datos del chofer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                    )}
                  </div>

                  {/* Driver Details List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 text-xs">
                    <div className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]/80">
                      <div className="text-[#64748B] text-[11px] font-semibold mb-0.5">
                        Licencia de Conducir
                      </div>
                      <div className="font-bold text-slate-900 font-mono">
                        {activeDriver.licenseNumber || 'Sin número'}
                      </div>
                      <div className="text-[11px] text-[#2563EB] font-medium mt-0.5">
                        {activeDriver.licenseCategory}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]/80">
                      <div className="text-[#64748B] text-[11px] font-semibold mb-0.5">
                        Vencimiento de Licencia
                      </div>
                      <div className="font-bold text-slate-900">
                        {activeDriver.licenseExpiry
                          ? new Date(
                              activeDriver.licenseExpiry + 'T00:00:00'
                            ).toLocaleDateString('es-AR')
                          : 'No especificado'}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block ${
                            driverLicenseDays < 0
                              ? 'bg-rose-200 text-rose-900'
                              : driverLicenseDays <= 30
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {driverLicenseDays < 0
                            ? 'Vencida'
                            : driverLicenseDays <= 30
                            ? `⚠️ Vence en ${driverLicenseDays} días`
                            : `✅ Al día (${driverLicenseDays} días)`}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]/80">
                      <div className="text-[#64748B] text-[11px] font-semibold mb-0.5">
                        Teléfono Móvil
                      </div>
                      {activeDriver.phone ? (
                        <a
                          href={`tel:${activeDriver.phone}`}
                          className="font-bold text-[#2563EB] hover:underline flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{activeDriver.phone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">No especificado</span>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]/80">
                      <div className="text-[#64748B] text-[11px] font-semibold mb-0.5">
                        Correo Corporativo
                      </div>
                      {activeDriver.email ? (
                        <a
                          href={`mailto:${activeDriver.email}`}
                          className="font-bold text-[#2563EB] hover:underline flex items-center gap-1.5 truncate"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{activeDriver.email}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">No especificado</span>
                      )}
                    </div>
                  </div>

                  {/* Driver Observations */}
                  {activeDriver.notes && (
                    <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-950">
                      <div className="font-bold text-[11px] text-amber-900 mb-0.5">
                        Observaciones Operativas:
                      </div>
                      <div>{activeDriver.notes}</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#64748B]">
                    ID Conductor: <code className="font-mono">{activeDriver.id}</code>
                  </span>
                  <button
                    onClick={() => setCurrentTab('conductores')}
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver módulo choferes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. DATOS DEL VEHICULO ASIGNADO */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE3ED] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#DCE3ED]">
                    <div>
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                        Unidad Asignada al Conductor
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-[#172554] mt-0.5">
                        {assignedVehicle
                          ? `${assignedVehicle.brand} ${assignedVehicle.model} ${assignedVehicle.year}`
                          : 'Sin Vehículo Asignado'}
                      </h2>
                    </div>

                    {assignedVehicle ? (
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                          assignedVehicle.fleetStatus === 'disponible'
                            ? 'bg-emerald-100 text-emerald-800'
                            : assignedVehicle.fleetStatus === 'en_uso'
                            ? 'bg-blue-100 text-blue-800'
                            : assignedVehicle.fleetStatus === 'mantenimiento'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {assignedVehicle.fleetStatus || 'disponible'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 uppercase">
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Vehicle details when assigned */}
                  {assignedVehicle ? (
                    <div className="space-y-4 mt-4">
                      {/* Argentine Plate & Key Info Strip */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#172554] text-white">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-base font-black px-3 py-1 rounded-xl bg-slate-950 text-white border border-blue-400/40 tracking-wider">
                            {assignedVehicle.plate}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-white">
                              {assignedVehicle.brand} {assignedVehicle.model}
                            </div>
                            <div className="text-[11px] text-blue-200">
                              Año {assignedVehicle.year} · {assignedVehicle.color}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[11px] text-blue-200">
                            Odómetro Actual
                          </div>
                          <div className="text-sm font-black font-mono text-white">
                            {assignedVehicle.currentMileage.toLocaleString('es-AR')} km
                          </div>
                        </div>
                      </div>

                      {/* Operational Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]">
                          <span className="text-[10px] text-[#64748B] block font-semibold">
                            Combustible
                          </span>
                          <span className="font-bold text-slate-900 capitalize">
                            {assignedVehicle.fuelType}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]">
                          <span className="text-[10px] text-[#64748B] block font-semibold">
                            Tipo de Unidad
                          </span>
                          <span className="font-bold text-slate-900 capitalize">
                            {assignedVehicle.type}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED]">
                          <span className="text-[10px] text-[#64748B] block font-semibold">
                            Centro de Costos
                          </span>
                          <span className="font-bold text-slate-900 truncate block">
                            {assignedVehicle.costCenter || 'Operaciones'}
                          </span>
                        </div>
                      </div>

                      {/* Insurance Info Card */}
                      {vehInsurance ? (
                        <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <Shield className="w-5 h-5 text-[#2563EB] shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900">
                                Seguro: {vehInsurance.company}
                              </div>
                              <div className="text-[11px] text-slate-600">
                                Póliza: {vehInsurance.policyNumber}
                              </div>
                            </div>
                          </div>
                          {vehInsurance.emergencyPhone && (
                            <a
                              href={`tel:${vehInsurance.emergencyPhone}`}
                              className="px-2.5 py-1 rounded-xl bg-[#2563EB] text-white text-[11px] font-bold hover:bg-blue-700 transition"
                            >
                              Auxilio 24h
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] text-xs text-[#64748B] flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                          <span>Póliza de seguro no vinculada en el sistema.</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* When driver has NO vehicle assigned */
                    <div className="py-8 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                        <Truck className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          Sin vehículo asignado actualmente
                        </div>
                        <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1">
                          Este conductor está activo en la empresa pero aún no cuenta
                          con un vehículo de la flota bajo su responsabilidad.
                        </p>
                      </div>

                      {isOwner && (
                        <button
                          onClick={() => setDriverToEdit(activeDriver)}
                          className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Asignar Vehículo a este Chofer</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Actions for Assigned Vehicle */}
                {assignedVehicle && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedVehicleId(assignedVehicle.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#172554] hover:bg-blue-950 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Ver Ficha Completa ({assignedVehicle.plate})</span>
                    </button>

                    {isOwner && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setVehicleToAssign(assignedVehicle)}
                          className="px-3 py-1.5 rounded-xl bg-[#DBEAFE] hover:bg-blue-200 text-[#2563EB] text-xs font-bold transition cursor-pointer"
                        >
                          Cambiar Chofer
                        </button>
                        <button
                          onClick={() => {
                            assignDriverToVehicle(assignedVehicle.id, null);
                            showToast(
                              `Chofer desasignado de la unidad ${assignedVehicle.plate}`
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                        >
                          Desasignar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* DRIVER & VEHICLE OPERATIONAL METRIC SUMMARY TILES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
                  <Truck className="w-4 h-4 text-[#2563EB]" />
                  <span>Unidad en Ruta</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono truncate">
                  {assignedVehicle ? assignedVehicle.plate : 'Sin unidad'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {assignedVehicle
                    ? `${assignedVehicle.currentMileage.toLocaleString('es-AR')} km`
                    : 'No asignado'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <span>Licencia Chofer</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                  {driverLicenseDays < 0
                    ? 'Vencida'
                    : `${driverLicenseDays} días`}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {driverLicenseDays <= 30
                    ? 'Requiere renovación'
                    : 'Vigencia activa'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
                  <Fuel className="w-4 h-4 text-[#2563EB]" />
                  <span>Combustible Unidad</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                  ${vehFuelSpent.toLocaleString('es-AR')}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {vehFuelLiters} L registrados
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Alertas & Services</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                  {vehAlerts.length + vehIncidents.length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {vehAlerts.length} alertas · {vehIncidents.length} incidentes
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS FOR THIS DRIVER & VEHICLE */}
            <div className="bg-[#172554] rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-300" />
                <div>
                  <div className="font-bold text-sm">
                    Acciones Operativas Rápidas para {activeDriver.name}
                  </div>
                  <div className="text-xs text-blue-200">
                    {assignedVehicle
                      ? `Gestión directa sobre la unidad ${assignedVehicle.brand} ${assignedVehicle.model} (${assignedVehicle.plate})`
                      : 'Cargas y reportes sobre chofer'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {assignedVehicle && (
                  <button
                    onClick={() => setShowFuelModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Fuel className="w-3.5 h-3.5" />
                    <span>Cargar Combustible</span>
                  </button>
                )}
                {assignedVehicle && (
                  <button
                    onClick={() => setShowIncidentModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Reportar Incidente</span>
                  </button>
                )}
                <button
                  onClick={() => setCurrentTab('mantenimiento')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Historial Mantenimientos</span>
                </button>
              </div>
            </div>

            {/* TWO COLUMNS: VEHICLE MAINTENANCE & RECENT FUEL LOGS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Recent Maintenance for Assigned Vehicle */}
              <div className="bg-white rounded-3xl p-5 border border-[#DCE3ED] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#2563EB]" />
                    <h3 className="font-bold text-[#172554] text-sm">
                      Mantenimientos de la Unidad{' '}
                      {assignedVehicle ? `(${assignedVehicle.plate})` : ''}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('mantenimiento')}
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Ver todos</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {vehMaintenance.length > 0 ? (
                    vehMaintenance.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-slate-900 capitalize">
                            {m.type}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {m.date} · {m.mileage.toLocaleString('es-AR')} km · {m.workshop}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-slate-900 text-xs">
                            ${m.cost.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-[#64748B]">
                      No hay mantenimientos recientes registrados para esta unidad.
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Fuel Logs for Assigned Vehicle */}
              <div className="bg-white rounded-3xl p-5 border border-[#DCE3ED] shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-[#2563EB]" />
                    <h3 className="font-bold text-[#172554] text-sm">
                      Cargas de Combustible{' '}
                      {assignedVehicle ? `(${assignedVehicle.plate})` : ''}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentTab('combustible')}
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Ver todas</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {vehFuelLogs.length > 0 ? (
                    vehFuelLogs.slice(0, 4).map((f) => (
                      <div
                        key={f.id}
                        className="p-3 rounded-2xl bg-[#F3F6FA] border border-[#DCE3ED] text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {f.station}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {f.date} · {f.liters} L · {f.mileage.toLocaleString('es-AR')} km
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-slate-900 text-xs">
                            ${f.totalPrice.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-[#64748B]">
                      No hay cargas de combustible registradas para esta unidad.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Driver Edit Modal */}
      {driverToEdit && (
        <DriverFormModal
          driverToEdit={driverToEdit}
          onClose={() => setDriverToEdit(null)}
        />
      )}

      {/* Quick Assign Driver Modal */}
      {vehicleToAssign && (
        <QuickAssignDriverModal
          vehicle={vehicleToAssign}
          onClose={() => setVehicleToAssign(null)}
        />
      )}

      {/* Fuel Modal */}
      {showFuelModal && (
        <FuelModal
          defaultVehicleId={assignedVehicle?.id}
          onClose={() => setShowFuelModal(false)}
        />
      )}

      {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentModal
          defaultVehicleId={assignedVehicle?.id}
          onClose={() => setShowIncidentModal(false)}
        />
      )}
    </div>
  );
};
