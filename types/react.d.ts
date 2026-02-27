import * as React from 'react';

declare module 'react' {
  export interface ReactNode extends {} {}
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => (void | (() => void)), deps?: any[]): void;
}
