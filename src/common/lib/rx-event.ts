import { Subject } from "rxjs";

export class RxEvent<T = void> extends Subject<T> {
  fire(value: T) {
    this.next(value);
  }

  listen(fn: (value: T) => void) {
    const subscription = this.subscribe(fn);
    return () => subscription.unsubscribe();
  }
}
