import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import {
  BarChart3,
  Printer,
  Filter,
  Coins,
  Fuel,
  Wrench,
  AlertTriangle,
  Calendar,
  Truck,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { vehicles, expenses, fuelLogs, maintenance, incidents, drivers, showToast } =
    useGarage();

  const [filterPeriod, setFilterPeriod] = useState('mes');
  const [filterVehicle, setFilterVehicle] = useState('todos');
  const [filterCostCenter, setFilterCostCenter] = useState('todos');

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchVeh = filterVehicle === 'todos' || e.vehicleId === filterVehicle;
    const matchCost = filterCostCenter === 'todos' || e.costCenter === filterCostCenter;
    return matchVeh && matchCost;
  });

  // Filtered maintenance
  const filteredMaintenance = maintenance.filter((m) => {
    return filterVehicle === 'todos' || m.vehicleId === filterVehicle;
  });

  // Filtered fuel
  const filteredFuel = fuelLogs.filter((f) => {
    return filterVehicle === 'todos' || f.vehicleId === filterVehicle;
  });

  // Dynamic calculations
  const maintenanceCost = filteredMaintenance.reduce((sum, m) => sum + m.cost, 0);
  const fuelCost = filteredFuel.reduce((sum, f) => sum + f.totalPrice, 0);
  const totalFleetCost = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const otherExpenses = Math.max(0, totalFleetCost - maintenanceCost - fuelCost);

  // Distinct cost centers
  const costCenters = Array.from(
    new Set(
      vehicles
        .map((v) => v.costCenter)
        .filter((c): c is string => !!c)
    )
  );

  const handleExportCSV = () => {
    let csv = 'ID,Vehiculo,Fecha,Categoria,Descripcion,Monto,CentroCosto\n';
    filteredExpenses.forEach((e) => {
      csv += `"${e.id}","${e.vehicleName}","${e.date}","${e.category}","${e.description}",${e.amount},"${e.costCenter || 'General'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `MiGarage_Informe_Flota_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Informe CSV descargado con éxito');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Informes & Auditoría de Flota
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Análisis de costos totales, combustible, siniestralidad y reportes ejecutivos exportables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#172554] hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE3ED] shadow-xs flex flex-wrap items-center gap-3 text-xs no-print">
        <div className="flex items-center gap-2 text-slate-600 font-bold">
          <Filter className="w-4 h-4 text-[#2563EB]" />
          <span>Filtros:</span>
        </div>

        <select
          value={filterVehicle}
          onChange={(e) => setFilterVehicle(e.target.value)}
          className="p-2 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] font-semibold text-slate-800"
        >
          <option value="todos">Todos los vehículos ({vehicles.length})</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.brand} {v.model} ({v.plate})
            </option>
          ))}
        </select>

        <select
          value={filterCostCenter}
          onChange={(e) => setFilterCostCenter(e.target.value)}
          className="p-2 rounded-xl bg-[#F3F6FA] border border-[#DCE3ED] font-semibold text-slate-800"
        >
          <option value="todos">Todos los centros de costo</option>
          {costCenters.map((c) => (
            <option key={c} value={c}>
              🏢 {c}
            </option>
          ))}
        </select>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
        <h2 className="text-2xl font-black text-slate-900">
          MiGarage Empresa — Informe Ejecutivo de Flota
        </h2>
        <p className="text-xs text-slate-600">
          Fecha de emisión: {new Date().toLocaleDateString('es-AR')} · Unidades:{' '}
          {filterVehicle === 'todos' ? 'Flota completa' : 'Unidad individual'}
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Coins className="w-4 h-4 text-[#2563EB]" />
            <span>Gasto Total Flota</span>
          </div>
          <div className="text-2xl font-extrabold text-[#172554] font-mono mt-1">
            ${totalFleetCost.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">{filteredExpenses.length} movimientos</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Fuel className="w-4 h-4 text-[#2563EB]" />
            <span>Total Combustible</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-mono mt-1">
            ${fuelCost.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">{filteredFuel.length} cargas registradas</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <Wrench className="w-4 h-4 text-[#2563EB]" />
            <span>Total Mantenimiento</span>
          </div>
          <div className="text-2xl font-extrabold text-[#15803D] font-mono mt-1">
            ${maintenanceCost.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">{filteredMaintenance.length} intervenciones</div>
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="bg-white rounded-3xl p-5 border border-[#DCE3ED] shadow-xs space-y-3">
        <h3 className="font-bold text-[#172554] text-sm">Desglose de Gastos Operativos</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3F6FA] text-slate-700 uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3 rounded-l-xl">Fecha</th>
                <th className="p-3">Vehículo</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Descripción</th>
                <th className="p-3">Centro de Costo</th>
                <th className="p-3 text-right rounded-r-xl">Monto ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono">{e.date}</td>
                  <td className="p-3 font-bold text-slate-900">{e.vehicleName}</td>
                  <td className="p-3 capitalize">{e.category}</td>
                  <td className="p-3 text-slate-600">{e.description}</td>
                  <td className="p-3">{e.costCenter || 'Operaciones'}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ${e.amount.toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
