import React, { useState } from 'react';
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

export function getOrInitialStores<STORES = any, FETCH = any>(stores: STORES, {
  initialState = {},
  fetchClient,
}: Options<STORES, FETCH> = {}) {
  if (_initialStores) return _initialStores;
  
  const rootStore = new RootStore();
  return Object.entries(stores).reduce(
    (acc, [storeName, Store]) => {
      const storeInstanceName = `${storeName
        .charAt(0)
        .toLowerCase()}${storeName.slice(1)}`;
      const storeInstance = new Store(initialState[storeInstanceName] || {});
      storeInstance.fetch = fetchClient;
      storeInstance.set = (key: string, value: any) => {
        storeInstance[key] = value;
      };
      rootStore.set(storeName, storeInstance);
      return {
        ...acc,
        [storeInstanceName]: storeInstance,
      };
    },
    {}
  );
};

const fillUpStoresReactivity = (setState: any, stores: Record<string, any>) => {
  Object.entries(stores).forEach(([storeName, store]) => {
    store.__proto__.updateState = storeData => {
      setState(prev => ({
        ...prev,
        [storeName]: storeData,
      }));
    };
    store.rootStore = stores;
  })
}

const RootStoreContext = React.createContext<any>({});
export const useStores = <S, >(): S => React.useContext(RootStoreContext);

export const RootStoreProvider = ({ children, options = {}, stores = {} }) => {
  const [state, setState] = useState(() => {
    return getOrInitialStores(stores, options);
  });
  if (typeof window !== 'undefined') {
    fillUpStoresReactivity(setState, state);
  }
  
  return (
    <RootStoreContext.Provider value={state}>
      {children}
    </RootStoreContext.Provider>
  );
};
