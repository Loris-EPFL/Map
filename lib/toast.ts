// Minimal app-wide toast/snackbar. A module-level pub/sub so any client
// component can call `toast(...)` and the single <Toaster /> mounted in the
// root layout renders it — no provider/context wiring needed.

export type ToastAction = { label: string; onClick: () => void };

export type ToastInput = {
  message: string;
  /** Optional single action, e.g. an Undo button. */
  action?: ToastAction;
  /** Auto-dismiss after ms. Defaults: 6500 with an action, 3500 without. */
  duration?: number;
};

export type ToastItem = ToastInput & { id: number; duration: number };

type Listener = (t: ToastItem) => void;

const listeners = new Set<Listener>();
let counter = 0;

export function toast(input: ToastInput): number {
  const id = ++counter;
  const item: ToastItem = {
    duration: input.action ? 6500 : 3500,
    ...input,
    id,
  };
  listeners.forEach((l) => l(item));
  return id;
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
