import Provider from './provider';
import { createElement } from 'react';
// import { TarComponentProps, IStore } from '../types/interface';

export const connect = function (TarComponent: React.FC<TarComponentProps>) {
  return (store: IStore) => {
    return (props: any) => (
      <Provider {...props} store={store}>
        <TarComponent />
      </Provider>
    );
  };
};
export const storeConnect = function (TarComponent: React.FC<TarComponentProps>) {
  return (props: any) => (
    <Provider {...props} store={props.store}>
      <TarComponent />
    </Provider>
  );
};
export const storeComponentConnect = function (TarComponent: React.FC<TarComponentProps>) {
  return (store: IStore) => {
    return (props: any) => (
      <Provider {...props} isComponent store={store}>
        <TarComponent />
      </Provider>
    );
  };
};
