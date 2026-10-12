import React, { useState } from 'react';
import { useGarage } from '../../context/GarageContext';
import { Vehicle, InsurancePolicy, Driver } from '../../types';
import {
  Shield,
  Phone,
  Share2,
  Copy,
  Check,
  X,
  AlertTriangle,
  FileText,
  Car,
  User,
  ExternalLink,
  MessageCircle,
  Printer,
  ChevronDown,
  Info,
  Calendar,
  Clock,
  Send,
} from 'lucide-react';

interface ShareInsuranceModalProps {
  vehicleId: string;
  onClose: () => void;
  onOpenReportIncident?: (vehicleId: string) => void;
}

export const ShareInsuranceModal: React.FC<ShareInsuranceModalProps> = ({
  vehicleId,
  onClose,
  onOpenReportIncident,
}) => {
  const { vehicles, insurance, drivers, isOwner, showToast } = useGarage();
  const [copied, setCopied] = useState(false);
  const [thirdPartyPhone, setThirdPartyPhone] = useState('');
  const [showChecklist, setShowChecklist] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleId);

  const vehicle: Vehicle | undefined = vehicles.find((v) => v.id === selectedVehicleId);
  const policy: InsurancePolicy | undefined = insurance.find(
    (ins) => ins.vehicleId === selectedVehicleId
  );
  const driver: Driver | undefined = vehicle?.assignedDriverId
    ? drivers.find((d) => d.id === vehicle.assignedDriverId)
    : undefined;

  if (!vehicle) {
    return null;
  }

  // Fallback policy if vehicle has none registered yet
  const activePolicy: InsurancePolicy = policy || {
    id: `temp-${vehicle.id}`,
    vehicleId: vehicle.id,
    vehicleName: `${vehicle.brand} ${vehicle.model} (${vehicle.plate})`,
    company: 'Sancor Seguros Corporativo',
    policyNumber: `SNC-FLOTA-${vehicle.plate.replace(/\s+/g, '')}`,
    coverageType: 'Todo Riesgo Flota Comercial con Asistencia 24h',
    startDate: '2026-01-01',
    expiryDate: '2027-01-01',
    assistancePhone: '0800-555-2850',
    emergencyPhone: '0800-777-4648',
    notes: 'Póliza de flota corporativa con auxilio mecánico pesado.',
  };

  const generateShareText = (includeInstructions = true) => {
    return `🚨 *DATOS DE SEGURO Y VEHÍCULO - CONSTANCIA PARA SINIESTRO*
═══════════════════════════════
🚗 *RODADO ASEGURADO:*
• Dominio / Patente: *${vehicle.plate}*
• Marca y Modelo: *${vehicle.brand} ${vehicle.model}* ${vehicle.version ? `(${vehicle.version})` : ''}
• Año: ${vehicle.year} | Color: ${vehicle.color}
• Tipo: ${vehicle.type.toUpperCase()} | Combustible: ${vehicle.fuelType}

🛡️ *PÓLIZA DE SEGURO:*
• Compañía Aseguradora: *${activePolicy.company}*
• N° de Póliza: *${activePolicy.policyNumber}*
• Cobertura: *${activePolicy.coverageType}*
• Vigencia: Hasta *${activePolicy.expiryDate}* (Póliza Vigente)
• Auxilio Mecánico y Grúa 24h: 📞 ${activePolicy.assistancePhone}
• Denuncia de Siniestros 24h: 🚨 ${activePolicy.emergencyPhone}

🏢 *TITULAR / TOMADOR:*
• Empresa: Transportes & Logística MiGarage S.A.
• CUIT: 30-71448291-8
• Contacto Base Flota: +54 9 11 4455-8899

👤 *CONDUCTOR ASIGNADO:*
• Nombre: ${driver ? driver.name : vehicle.assignedDriverName || 'Chofer de flota autorizado'}
${driver ? `• DNI: ${driver.dni}\n• Licencia: ${driver.licenseNumber} (Cat. ${driver.licenseCategory})\n• Teléfono: ${driver.phone}` : ''}
═══════════════════════════════
${includeInstructions ? `ℹ️ *Constancia digital para trámites de intercambio de datos tras siniestro o pedido de auxilio mecánico.*` : ''}`;
  };

  const handleCopy = async () => {
    try {
      const text = generateShareText(true);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Datos del seguro copiados al portapapeles', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('No se pudo copiar automáticamente. Por favor seleccioná el texto.', 'warning');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText(true));
    let cleanPhone = thirdPartyPhone.replace(/\D/g, '');
    if (cleanPhone.length > 0 && !cleanPhone.startsWith('54') && cleanPhone.length <= 10) {
      // standard Argentine mobile prefix
      cleanPhone = `549${cleanPhone}`;
    }
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Seguro ${vehicle.plate} - ${vehicle.brand} ${vehicle.model}`,
          text: generateShareText(true),
        });
        showToast('Datos compartidos correctamente', 'success');
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header Bar */}
        <div className="bg-[#172554] px-4 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Datos de Seguro en Siniestro
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 uppercase tracking-wider">
                  Vigente
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Constancia y auxilio mecánico 24h para intercambiar con terceros o peritaje
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle Switcher (if user wants to quickly check another unit) */}
        {vehicles.length > 1 && (
          <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-semibold flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-600" />
              Unidad seleccionada:
            </span>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer focus:outline-hidden focus:border-blue-600"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} — {v.brand} {v.model} ({v.assignedDriverName || 'Sin chofer'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Main Visual Insurance & Vehicle Card (Argentine Digital Credential Style) */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#172554] via-[#1e3a8a] to-[#0f172a] text-white p-5 shadow-lg border border-blue-900/80">
            {/* Watermark Logo */}
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-white">
              <Shield className="w-44 h-44" />
            </div>

            {/* Top Bar: Argentine Plate & Insurer Brand */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/15">
              <div className="flex items-center gap-3">
                {/* Official Argentine Plate Replica */}
                <div className="bg-white text-slate-900 rounded-lg px-3 py-1 font-mono font-black text-sm tracking-wider shadow-md border-2 border-slate-800 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-blue-600">🇦🇷</span>
                  <span>{vehicle.plate}</span>
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white">
                    {vehicle.brand} {vehicle.model}
                  </div>
                  <div className="text-[11px] text-blue-200">
                    Año {vehicle.year} · {vehicle.color} · {vehicle.type}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                  Compañía Aseguradora
                </div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5 justify-end">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>{activePolicy.company}</span>
                </div>
              </div>
            </div>

            {/* Middle Grid: Policy Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-4 text-xs">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold block">
                  Número de Póliza
                </span>
                <span className="font-mono font-black text-base text-amber-300 mt-0.5 block select-all">
                  {activePolicy.policyNumber}
                </span>
                <span className="text-[10px] text-blue-200 mt-0.5 block">
                  Póliza Corporativa de Flota
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold block">
                  Tipo de Cobertura
                </span>
                <span className="font-bold text-xs text-white mt-0.5 block">
                  {activePolicy.coverageType}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold mt-0.5 block">
                  ✓ Vigente hasta {activePolicy.expiryDate}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold block">
                  Titular de la Póliza
                </span>
                <span className="font-bold text-xs text-white mt-0.5 block">
                  Transportes & Logística S.A.
                </span>
                <span className="text-[10px] text-blue-200 block">CUIT: 30-71448291-8</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold block">
                  Conductor Asignado
                </span>
                <span className="font-bold text-xs text-white mt-0.5 block">
                  {driver ? driver.name : vehicle.assignedDriverName || 'Chofer autorizado'}
                </span>
                {driver && (
                  <span className="text-[10px] text-blue-200 block">
                    DNI {driver.dni} · Lic. {driver.licenseCategory}
                  </span>
                )}
              </div>
            </div>

            {/* Emergency Hotline Direct Phone Strip */}
            <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-blue-200 uppercase font-bold">
                    Auxilio Mecánico / Grúa 24h
                  </div>
                  <div className="text-sm font-black font-mono text-white">
                    {activePolicy.assistancePhone}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activePolicy.assistancePhone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Llamar Grúa</span>
                </a>
                <a
                  href={`tel:${activePolicy.emergencyPhone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-950/40"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Denuncia Siniestro</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Sharing Toolbar */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Opciones Rápidas para Compartir con el Tercero o Grúa
            </h3>

            {/* Direct WhatsApp Share Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Enviar Constancia Completa por WhatsApp</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700">1 Clic</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    placeholder="Número WhatsApp del tercero (ej: 11 4455 6677)"
                    value={thirdPartyPhone}
                    onChange={(e) => setThirdPartyPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <button
                  onClick={handleWhatsAppShare}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/20 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{thirdPartyPhone ? 'Enviar al Tercero' : 'Compartir por WhatsApp'}</span>
                </button>
              </div>
              <p className="text-[11px] text-emerald-800/80">
                Podés ingresar el celular de la otra persona para enviárselo directamente o dejarlo vacío para elegirlo en tu lista de chats.
              </p>
            </div>

            {/* Secondary Sharing Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handleCopy}
                className="p-3 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 transition flex items-center justify-center gap-2 text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-blue-600" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNativeShare}
                className="p-3 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 transition flex items-center justify-center gap-2 text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4 text-purple-600" />
                <span>Compartir Móvil</span>
              </button>

              <button
                onClick={handlePrint}
                className="p-3 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 transition flex items-center justify-center gap-2 text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimir Ficha</span>
              </button>
            </div>
          </div>

          {/* Siniestro Protocol Checklist (Essential for Drivers during an incident) */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 overflow-hidden">
            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-amber-950 hover:bg-amber-100/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>¿Qué hacer en caso de siniestro? (Protocolo de Acción Rápida)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-amber-700 transition-transform ${
                  showChecklist ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showChecklist && (
              <div className="px-4 pb-4 pt-1 space-y-2.5 text-xs text-amber-900 border-t border-amber-200/60">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 font-bold text-[11px] flex items-center justify-center shrink-0 text-amber-900">
                    1
                  </span>
                  <p>
                    <strong>Prioridad médica:</strong> Comprobá la salud de todos los involucrados. Si hay personas heridas, llamá de inmediato al <strong>107</strong> (SAME) o al <strong>911</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 font-bold text-[11px] flex items-center justify-center shrink-0 text-amber-900">
                    2
                  </span>
                  <p>
                    <strong>Fotografiar la escena:</strong> Antes de mover los vehículos, sacá fotos de los daños de ambos rodados, patentes, posición de impacto y marcas viales.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 font-bold text-[11px] flex items-center justify-center shrink-0 text-amber-900">
                    3
                  </span>
                  <p>
                    <strong>Intercambiar datos:</strong> Compartí esta ficha con el tercero y solicitale su <em>Nombre, DNI, Licencia, Patente, Aseguradora, N° de Póliza y Teléfono</em>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 font-bold text-[11px] flex items-center justify-center shrink-0 text-amber-900">
                    4
                  </span>
                  <p>
                    <strong>No admitir culpa en la calle:</strong> No firmes acuerdos privados ni aceptes responsabilidades económicas en el lugar.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 font-bold text-[11px] flex items-center justify-center shrink-0 text-amber-900">
                    5
                  </span>
                  <p>
                    <strong>Plazo de denuncia legal:</strong> Registrá el siniestro en la app MiGarage y llamá a la aseguradora dentro de las <strong>72 horas hábiles</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500">
            Póliza: <strong className="text-slate-800">{activePolicy.policyNumber}</strong> · Unidad {vehicle.plate}
          </div>

          <div className="flex items-center gap-2">
            {onOpenReportIncident && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReportIncident(vehicle.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Denunciar Siniestro</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
