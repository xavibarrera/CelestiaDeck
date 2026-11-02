import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already installed or dismissed, hide
  if (isInstalled || isDismissed) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <div className="relative flex items-center">
        <button
          onClick={install}
          aria-label="Instalar aplicación CelestiaDeck"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-violet-500/20 border border-amber-400/40 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-amber-300 hover:bg-amber-400/20 transition-all shadow-sm active:scale-95 touch-manipulation"
        >
          <Download className="w-3.5 h-3.5 text-amber-400 animate-bounce flex-shrink-0" />
          <span className="hidden xs:inline">Instalar App</span>
          <span className="xs:hidden">Instalar</span>
        </button>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSModal(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-800/80 border border-slate-700 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white transition shadow-sm active:scale-95 touch-manipulation"
        >
          <Smartphone className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          <span className="hidden xs:inline">Instalar en iOS</span>
          <span className="xs:hidden">Instalar</span>
        </button>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl relative text-slate-200">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-amber-400/50 flex items-center justify-center">
                  <span className="text-amber-400 text-lg">✨</span>
                </div>
                <div>
                  <h3 className="font-serif-mystic text-lg font-bold text-amber-300">Instalar CelestiaDeck</h3>
                  <p className="text-xs text-slate-400">Guarda la app en tu pantalla de inicio</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    1
                  </span>
                  <p>
                    Toca el botón <strong className="text-white flex items-center gap-1 inline-flex">Compartir <Share2 className="w-3.5 h-3.5 text-sky-400" /></strong> en la barra inferior de Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                  <p>
                    Desplázate hacia abajo y selecciona <strong className="text-white flex items-center gap-1 inline-flex">Añadir a pantalla de inicio <PlusSquare className="w-3.5 h-3.5 text-emerald-400" /></strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    3
                  </span>
                  <p>
                    Confirma tocando <strong className="text-white">Añadir</strong>. ¡Listo para usar 100% offline!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 py-2.5 text-xs font-semibold text-slate-950 shadow-lg transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
