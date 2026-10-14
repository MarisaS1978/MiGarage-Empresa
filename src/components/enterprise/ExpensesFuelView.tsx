import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Expense, FuelLog } from '../../types';
import {
  Coins,
  Fuel,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Gauge,
  Trash2,
  Edit,
  Filter,
  Search,
} from 'lucide-react';
import { ExpenseModal } from './ExpenseModal';
import { FuelModal } from './FuelModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const ExpensesFuelView: React.FC = () => {
  const { expenses, fuelLogs, deleteExpense, deleteFuelLog, isOwner } = useGarage();
  const [subTab, setSubTab] = useState<'gastos' | 'combustible'>('gastos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const [showFuelModal, setShowFuelModal] = useState(false);
  const [fuelToEdit, setFuelToEdit] = useState<FuelLog | null>(null);
  const [fuelToDelete, setFuelToDelete] = useState<FuelLog | null>(null);

  // Compute expenses total
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Compute fuel totals & metrics
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const totalFuelSpent = fuelLogs.reduce((sum, f) => sum + f.totalPrice, 0);
  const avgPricePerLiter = totalFuelLiters > 0 ? totalFuelSpent / totalFuelLiters : 0;

  const filteredExpenses = expenses.filter(
    (e) =>
      e.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.vendor && e.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFuelLogs = fuelLogs.filter(
    (f) =>
      f.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteExpenseConfirm = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      setExpenseToDelete(null);
    }
  };

  const handleDeleteFuelConfirm = () => {
    if (fuelToDelete) {
      deleteFuelLog(fuelToDelete.id);
      setFuelToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Gastos & Combustible
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            Control de costos operativos, consumos de gasoil/nafta y trazabilidad por centro de costo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Nuevo Gasto</span>
            </button>
          )}
          <button
            onClick={() => setShowFuelModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-900/20 transition cursor-pointer"
          >
            <Fuel className="w-4 h-4" />
            <span>Cargar Combustible</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Gastos Totales Registrados</div>
          <div className="text-2xl font-bold text-[#172554] font-mono mt-1">
            ${totalExpense.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">{expenses.length} comprobantes cargados</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Total Despacho Combustible</div>
          <div className="text-2xl font-bold text-[#2563EB] font-mono mt-1">
            ${totalFuelSpent.toLocaleString('es-AR')}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">{totalFuelLiters.toFixed(1)} L despachados</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DCE3ED] shadow-xs">
          <div className="text-xs font-semibold text-[#64748B]">Precio Promedio Litro</div>
          <div className="text-2xl font-bold text-[#15803D] font-mono mt-1">
            ${avgPricePerLiter.toFixed(2)} / L
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Promedio ponderado en flota</div>
        </div>
      </div>

      {/* Switcher Tab & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#DCE3ED] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSubTab('gastos');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              subTab === 'gastos'
                ? 'bg-[#172554] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Gastos Operativos ({expenses.length})</span>
          </button>

          <button
            onClick={() => {
              setSubTab('combustible');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              subTab === 'combustible'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Fuel className="w-4 h-4" />
            <span>Cargas de Combustible ({fuelLogs.length})</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            (document.activeElement as HTMLElement)?.blur();
          }}
          className="relative w-full sm:w-72"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            enterKeyHint="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            placeholder="Buscar por vehículo o detalle..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#DCE3ED] text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#2563EB]"
          />
        </form>
      </div>

      {/* SUBTAB GASTOS */}
      {subTab === 'gastos' && (
        <div className="space-y-3">
          {filteredExpenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCE3ED] hover:border-[#2563EB]/40 transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono">{exp.vehicleName}</span>
                  <span className="font-semibold text-xs px-2 py-0.5 rounded-full bg-[#DBEAFE] text-blue-900 capitalize">
                    {exp.category}
                  </span>
                  <span className="text-[#64748B] font-mono text-[11px]">{exp.date}</span>
                </div>
                <p className="text-slate-700 text-xs">{exp.description}</p>
                <div className="text-[11px] text-[#64748B]">
                  {exp.vendor && <span>Proveedor: {exp.vendor}</span>}
                  {exp.costCenter && <span> · Centro de Costo: {exp.costCenter}</span>}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="font-mono font-extrabold text-base text-[#172554]">
                  ${exp.amount.toLocaleString('es-AR')}
                </span>

                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpenseToEdit(exp)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      title="Editar gasto"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpenseToDelete(exp)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#DCE3ED] text-xs text-slate-500">
              No se encontraron gastos registrados.
            </div>
          )}
        </div>
      )}

      {/* SUBTAB COMBUSTIBLE */}
      {subTab === 'combustible' && (
        <div className="space-y-3">
          {filteredFuelLogs.map((fl) => (
            <div
              key={fl.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-[#DCE3ED] hover:border-[#2563EB]/40 transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono">{fl.vehicleName}</span>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase">
                    {fl.fuelType}
                  </span>
                  <span className="text-[#64748B] font-mono text-[11px]">{fl.date}</span>
                  <span className="font-semibold text-slate-700">· {fl.station}</span>
                </div>
                <div className="text-slate-600">
                  {fl.liters} L cargados · Odómetro: {fl.mileage.toLocaleString('es-AR')} km · ($
                  {fl.pricePerLiter.toFixed(0)}/L)
                </div>
                {fl.notes && <div className="text-[11px] text-[#64748B] italic">{fl.notes}</div>}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="font-mono font-extrabold text-base text-[#172554]">
                  ${fl.totalPrice.toLocaleString('es-AR')}
                </span>

                {isOwner && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFuelToEdit(fl)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                      title="Editar carga"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setFuelToDelete(fl)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      title="Eliminar carga"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredFuelLogs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#DCE3ED] text-xs text-slate-500">
              No se encontraron cargas de combustible registradas.
            </div>
          )}
        </div>
      )}

      {/* Expense Modals */}
      {showExpenseModal && (
        <ExpenseModal onClose={() => setShowExpenseModal(false)} />
      )}
      {expenseToEdit && (
        <ExpenseModal
          expenseToEdit={expenseToEdit}
          onClose={() => setExpenseToEdit(null)}
        />
      )}
      {expenseToDelete && (
        <ConfirmDeleteModal
          isOpen={!!expenseToDelete}
          onClose={() => setExpenseToDelete(null)}
          onConfirm={handleDeleteExpenseConfirm}
          title="¿Eliminar comprobante de gasto?"
          itemName={`${expenseToDelete.description}`}
          itemSubtitle={`${expenseToDelete.date} — $${expenseToDelete.amount.toLocaleString('es-AR')}`}
        />
      )}

      {/* Fuel Modals */}
      {showFuelModal && (
        <FuelModal onClose={() => setShowFuelModal(false)} />
      )}
      {fuelToEdit && (
        <FuelModal
          fuelLogToEdit={fuelToEdit}
          onClose={() => setFuelToEdit(null)}
        />
      )}
      {fuelToDelete && (
        <ConfirmDeleteModal
          isOpen={!!fuelToDelete}
          onClose={() => setFuelToDelete(null)}
          onConfirm={handleDeleteFuelConfirm}
          title="¿Eliminar registro de combustible?"
          itemName={`Carga de ${fuelToDelete.liters} L en ${fuelToDelete.station}`}
          itemSubtitle={`${fuelToDelete.date} — $${fuelToDelete.totalPrice.toLocaleString('es-AR')}`}
        />
      )}
    </div>
  );
};
