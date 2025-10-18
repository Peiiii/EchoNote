import { BehaviorSubject } from "rxjs";
import { ReactNode } from "react";
import { ModalInstance, ModalController, ModalOptions } from "./types";

class ModalManager {
  private instances$ = new BehaviorSubject<ModalInstance[]>([]);
  private baseZIndex = 1000;
  private nextId = 0;

  get instances() {
    return this.instances$.value;
  }

  get instancesObservable() {
    return this.instances$;
  }

  show(content: ReactNode, options: ModalOptions = {}): ModalController {
    const id = `modal-${++this.nextId}`;
    const zIndex = this.baseZIndex + this.instances.length;
    
    const instance: ModalInstance = {
      id,
      content,
      options,
      zIndex,
    };

    const newInstances = [...this.instances, instance];
    this.instances$.next(newInstances);

    return {
      id,
      close: (result?: unknown) => this.hide(id, result),
    };
  }

  hide(id: string, result?: unknown): void {
    const instance = this.instances.find(inst => inst.id === id);
    if (!instance) return;

    const newInstances = this.instances.filter(inst => inst.id !== id);
    this.instances$.next(newInstances);

    instance.options.onClose?.(result);
  }

  hideAll(): void {
    this.instances.forEach(instance => {
      instance.options.onClose?.();
    });
    this.instances$.next([]);
  }
}

export const modalManager = new ModalManager();
