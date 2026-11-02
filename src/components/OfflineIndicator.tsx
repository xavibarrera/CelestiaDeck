import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 border border-amber-500/40 px-3.5 py-1 text-xs font-medium text-amber-300 shadow-xl backdrop-blur-md animate-fade-in">
      <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      <span>Modo sin conexión • CelestiaDeck funciona 100% local</span>
    </div>
  );
};
