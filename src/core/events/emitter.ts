export type Unsubscribe = () => void;

export class Emitter<T> {
  private listeners = new Set<(payload: T) => void>();

  on(fn: (payload: T) => void): Unsubscribe {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(payload: T): void {
    for (const fn of Array.from(this.listeners)) fn(payload);
  }

  clear(): void {
    this.listeners.clear();
  }
}
