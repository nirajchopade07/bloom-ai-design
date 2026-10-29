import React, { useEffect, useState } from 'react';
import { X, Sparkles, User, Cpu, ShieldCheck, Activity, Database } from 'lucide-react';
import { apiService, HealthStatus } from '../services/api';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    if (isOpen) {
      apiService.getHealth().then((data) => {
        if (data) setHealth(data);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="liquid-glass-strong rounded-3xl p-6 sm:p-8 max-w-md w-full flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 id="account-modal-title" className="text-xl font-medium text-white tracking-tight">
                Botanical Studio Account
              </h2>
              <p className="text-xs text-white/60">Tier: Generative Architect</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account modal"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-white/70" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Compute Cluster</span>
                <span className="text-xs text-white/50">{health?.engine || 'Neural Voxel Diffusion Engine'}</span>
              </div>
            </div>
            <span className="text-xs text-white/80 px-2.5 py-1 rounded-full bg-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {health?.status === 'online' ? 'Active' : 'Connected'}
            </span>
          </div>

          <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-white/70" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Archived Specimens</span>
                <span className="text-xs text-white/50">Stored in server repository</span>
              </div>
            </div>
            <span className="text-sm font-medium text-white">{health?.totalSpecimens || 6} Spec</span>
          </div>

          <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-white/70" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Total Syntheses</span>
                <span className="text-xs text-white/50">Procedural 3D flora meshes</span>
              </div>
            </div>
            <span className="text-sm font-medium text-white">
              {health ? health.totalSyntheses.toLocaleString() : '1,420'}
            </span>
          </div>

          <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-white/70" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Export License</span>
                <span className="text-xs text-white/50">Commercial spatial distribution</span>
              </div>
            </div>
            <span className="text-xs text-white/80">Authorized</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="liquid-glass-strong rounded-full py-3 text-center text-sm font-medium text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
