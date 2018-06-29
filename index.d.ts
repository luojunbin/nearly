export interface IConfig {
  defaultPure?: boolean;
  beforeConnect?: (storeName: string) => any;
  beforeDispatch?: (action: string) => any;
}

export function connect(storeNames: string | string[], Component: any, PlaceHolder?: any, isPure?: boolean): any;

export function getStore(storeName: string): any;

export function registerStore (storeName: string, dispatchers: object): any;

export function dispatch(action: string, ...args): Promise;

export function dispatcher(...args): any;

export function configure(config: IConfig): void;

export const ContextProvider: any;

export function prepare(storeNames: string | string[]): Promise;
