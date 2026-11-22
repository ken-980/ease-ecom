// src/lib/alert-store.ts
export type AlertVariant = 'success' | 'error' | 'caution';

export interface AlertItem {
  id: string;
  variant: AlertVariant;
  message: string;
  duration: number;
  createdAt: number;
}

export interface ShowAlertOptions {
  variant: AlertVariant;
  message: string;
  duration?: number; // Defaults to 5000ms (5s)
}

type AlertListener = (alerts: AlertItem[]) => void;

class AlertStore {
  private alerts: AlertItem[] = [];
  private listeners = new Set<AlertListener>();

  private emit() {
    const snapshot = [...this.alerts];
    this.listeners.forEach((listener) => listener(snapshot));
  }

  subscribe(listener: AlertListener): () => void {
    this.listeners.add(listener);
    listener([...this.alerts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  show({ variant, message, duration = 5000 }: ShowAlertOptions): string {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Append to bottom so newer alerts stack below existing ones
    this.alerts = [
      ...this.alerts,
      {
        id,
        variant,
        message,
        duration,
        createdAt: Date.now(),
      },
    ];

    this.emit();
    return id;
  }

  dismiss(id: string) {
    this.alerts = this.alerts.filter((alert) => alert.id !== id);
    this.emit();
  }

  clearAll() {
    this.alerts = [];
    this.emit();
  }
}

export const alertStore = new AlertStore();

// Callable anywhere: components, loaders, actions, or Axios interceptors
export const showAlert = (options: ShowAlertOptions) => alertStore.show(options);
export const dismissAlert = (id: string) => alertStore.dismiss(id);