// src/components/ui/GlobalAlertContainer.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  alertStore,
  dismissAlert,
  type AlertItem,
  type AlertVariant,
} from '../../lib/alert-store';

const VARIANT_CONFIG: Record<
  AlertVariant,
  {
    container: string;
    iconColor: string;
    progressBar: string;
    title: string;
    Icon: typeof CheckCircle2;
  }
> = {
  success: {
    container: 'bg-emerald-50/95 border-emerald-200 text-emerald-950',
    iconColor: 'text-emerald-600',
    progressBar: 'bg-emerald-500',
    title: 'Success',
    Icon: CheckCircle2,
  },
  error: {
    container: 'bg-rose-50/95 border-rose-200 text-rose-950',
    iconColor: 'text-rose-600',
    progressBar: 'bg-rose-500',
    title: 'Error',
    Icon: XCircle,
  },
  caution: {
    container: 'bg-amber-50/95 border-amber-200 text-amber-950',
    iconColor: 'text-amber-600',
    progressBar: 'bg-amber-500',
    title: 'Caution',
    Icon: AlertTriangle,
  },
};

interface AlertToastProps {
  alert: AlertItem;
}

const AlertToast = ({ alert }: AlertToastProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const remainingRef = useRef(alert.duration);
  const lastStartRef = useRef<number>(Date.now());

  const { container, iconColor, progressBar, title, Icon } =
    VARIANT_CONFIG[alert.variant];

  const triggerClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    // Wait for alertPopOut animation (220ms) before removing from store
    setTimeout(() => {
      dismissAlert(alert.id);
    }, 220);
  }, [alert.id, isClosing]);

  useEffect(() => {
    if (isPaused || isClosing) return;

    lastStartRef.current = Date.now();
    const timer = setTimeout(() => {
      triggerClose();
    }, remainingRef.current);

    return () => {
      clearTimeout(timer);
      const elapsed = Date.now() - lastStartRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    };
  }, [isPaused, isClosing, triggerClose]);

  return (
    <div
      role="alert"
      aria-live={alert.variant === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative overflow-hidden w-88 max-w-[calc(100vw-2rem)] rounded-xl border p-3.5 shadow-lg backdrop-blur-md transition-all duration-300 font-plus-font ${container} ${
        isClosing ? 'animate-alert-out' : 'animate-alert-in'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">
            {title}
          </p>
          <p className="text-sm font-medium leading-snug mt-0.5 break-words">
            {alert.message}
          </p>
        </div>

        <button
          type="button"
          onClick={triggerClose}
          aria-label="Close notification"
          className="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 5-second visual countdown bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
        <div
          className={`h-full origin-left ${progressBar}`}
          style={{
            animation: `alertProgressShrink ${alert.duration}ms linear forwards`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>
    </div>
  );
};

export const GlobalAlertContainer = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    return alertStore.subscribe(setAlerts);
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none"
    >
      {alerts.map((alert) => (
        <AlertToast key={alert.id} alert={alert} />
      ))}
    </div>,
    document.body
  );
};