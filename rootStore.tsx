import React, { useState, useEffect } from 'react';
import { webWorker } from './worker';
import { initWebWorker } from './initWorker';
import { Options } from './types';

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
}: Options<STORES, FETCH> = {}) {
  if (_initialStores) return _initialStores;
  
  const rootStore = new RootStore();
  return Object.entries(stores).reduce(
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
};

// @ts-ignore
export const worker: Worker = initWebWorker(webWorker);

export const useStores = (storeName: string) => {
  const [state, setState] = useState(0);
  
  const updateState = ({ data }: any) => {
    if (data.type !== storeName) return;
    setState(Math.random());
  };
  
  useEffect(() => {
    worker.addEventListener('message', updateState);
    return () => {
      worker.removeEventListener('message', updateState);
    };
  }, []);
  
  return _initialStores[storeName];
};

export const initializeRootStore = (stores = {}, options = {}) => {
  _initialStores = getOrInitialStores(stores, options);
};
