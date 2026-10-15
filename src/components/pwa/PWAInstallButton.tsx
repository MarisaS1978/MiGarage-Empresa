import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'sidebar' | 'mobile' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running as an installed PWA on the home screen, hide the install button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'manual') {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-400/40 text-blue-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${className}`}
          title="Instalar MiGarage como acceso directo en tu celular"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-300" />
          <span>Instalar en Celular</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'mobile') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-900/40 ${className}`}
          title="Instalar MiGarage en pantalla de inicio"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instalar en Pantalla de Inicio</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'full') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-xs ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Instalar MiGarage</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Header compact variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 border border-blue-400/40 text-xs font-bold transition cursor-pointer shadow-xs shrink-0 ${className}`}
        title="Instalar MiGarage en tu celular o pantalla de inicio"
        aria-label="Instalar aplicación en celular"
      >
        <Smartphone className="w-4 h-4 text-blue-300" />
        <span className="hidden md:inline">Instalar App</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
