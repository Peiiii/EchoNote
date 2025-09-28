import { useEffect, useState, useMemo } from 'react';
import type { Observable } from 'rxjs';

type ObservableOrGetObservable<T> = Observable<T> | (() => Observable<T>);

export function useValueFromObservable<T>(observableOrGetObservable: ObservableOrGetObservable<T>, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  
  const observable = useMemo(() => {
    return typeof observableOrGetObservable === 'function' 
      ? observableOrGetObservable() 
      : observableOrGetObservable;
  }, [observableOrGetObservable]);
  
  useEffect(() => {
    const sub = observable.subscribe(setValue);
    return () => sub.unsubscribe();
  }, [observable]);
  
  return value;
}

