import React, { useState, useEffect } from 'react';
import { webWorker } from './worker';
import { initWebWorker } from './initWorker';
import { Options, RootState } from './types';

let _initialStores;

export class RootStore{
  stores = new Map();
  
  set(storeName: string, store: any) {
    store.getRootStore = () => this;
    this.stores.set(storeName, store);
  }
  
  get(storeName) {
    if (Array.isArray(storeName)) {
      return storeName.map(store => this.stores.get(store));
    }
    return this.stores.get(storeName);
  }
}

export const getStoreInstanceName = (storeName: string) => (
  `${storeName
    .charAt(0)
    .toLowerCase()}${storeName.slice(1)}`
);

export function getOrInitialStores<STORES = any, FETCH = any>(stores: STORES, {
  initialState = {},
  fetchClient,
}: Options<STORES, FETCH> = {}): RootState<STORES, FETCH> {
  if (_initialStores) return _initialStores;
  
  const rootStore = new RootStore();
  _initialStores = Object.entries(stores).reduce(
    (acc, [storeName, Store]) => {
      const storeInstanceName = getStoreInstanceName(storeName);
      const storeInstance = new Store(initialState[storeInstanceName] || {});
      storeInstance.fetch = fetchClient;
      storeInstance.set = (key: string, value: any) => {
        storeInstance[key] = value;
      };
      rootStore.set(storeName, storeInstance);
      return {
        ...acc,
        [storeInstanceName]: Object.assign(storeInstance, initialState[storeInstanceName] || {}),
      };
    },
    {}
  );
  return _initialStores;
};

// @ts-ignore
export const worker: Worker = initWebWorker(webWorker);

const getPlainStore = (storeName: any) => ({
  ..._initialStores[storeName],
  ..._initialStores[storeName].__state,
});

export function useStores <R, SN = any>(
  storeName: keyof R,
  dependencies: (keyof SN)[] | false = [],
): R {
  const [state, setState] = useState(getPlainStore(storeName));
  
  const updateState = ({ data }: any) => {
    if (data.type !== storeName) return;
    const isNeedToUpdate =
      dependencies &&
      (!(dependencies as string[]).length
        || (dependencies as string[]).find(dep => {
          return _initialStores[storeName][dep] !== state[dep];
        }));
    if (!isNeedToUpdate) return;
    
    setState(getPlainStore(storeName));
  };
  
  useEffect(() => {
    worker.addEventListener('message', updateState);
    return () => {
      worker.removeEventListener('message', updateState);
    };
  }, []);
  
  return { [storeName]: (_initialStores as R)[storeName] } as any;
};


