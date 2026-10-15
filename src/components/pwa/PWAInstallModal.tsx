import React from 'react';
import {
  Download,
  X,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const result = await install();
    if (result === 'accepted') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-[#0f172a] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Cerrar modal de instalación"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#1e293b] p-1 border border-blue-500/30 shadow-lg shadow-blue-950/50 flex items-center justify-center shrink-0">
              <img
                src="/pwa-192x192.png"
                alt="Icono MiGarage"
                className="w-full h-full rounded-xl object-contain shadow-xs"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Acceso Directo Móvil
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1 tracking-tight">
                Instalar MiGarage
              </h3>
              <p className="text-xs text-blue-200/90 mt-0.5">
                Guardá el icono en tu pantalla de inicio
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Status if already installed */}
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">¡MiGarage ya está instalado!</span>
                <span className="text-emerald-700 text-[11px]">
                  Estás utilizando la aplicación desde tu pantalla de inicio con acceso directo.
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Value proposition cards */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Apertura al instante</span>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-tight">
                    Inicia directamente como app nativa a pantalla completa.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cero espacio</span>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-tight">
                    No consume memoria de Play Store o App Store.
                  </p>
                </div>
              </div>

              {/* iOS Safari Guided Steps */}
              {isIOS ? (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#172554]">
                    <Smartphone className="w-4 h-4 text-[#2563EB]" />
                    <span>Pasos para iPhone y iPad (Safari):</span>
                  </div>
                  <ol className="text-xs text-slate-700 space-y-2.5 pl-1">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Tocá el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 align-text-bottom mx-0.5" /> en la barra inferior de Safari.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        Deslizá el menú hacia abajo y seleccioná <strong className="text-slate-900">"Agregar a pantalla de inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 align-text-bottom mx-0.5" />.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        Confirmá tocando <strong className="text-slate-900">"Agregar"</strong> en la esquina superior derecha. ¡Listo!
                      </span>
                    </li>
                  </ol>
                </div>
              ) : (
                /* Android / Chrome / Edge Installation Flow */
                <div className="space-y-3">
                  {isInstallable ? (
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Instalar en este Celular / Dispositivo</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                        <span>Cómo guardar el acceso directo en Android / Chrome:</span>
                      </div>
                      <ol className="text-[11px] text-slate-600 space-y-1.5 list-decimal list-inside">
                        <li>
                          Tocá el menú de <strong>tres puntos (⋮)</strong> en la esquina superior derecha de tu navegador.
                        </li>
                        <li>
                          Seleccioná <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                        </li>
                        <li>
                          Confirmá la instalación para ver el icono con el logo de <strong>MiGarage</strong> en tu menú de apps.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Footer note */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px]">Icono oficial optimizado PWA</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
