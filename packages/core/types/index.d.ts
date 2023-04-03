/// <reference path="./interface.d.ts" />

export type SFCProps<T extends Models> = FCProps<T>;
export type Store<T extends Models> = TStores<T>;

export const createStore: <T extends Models>({ globalSpace, models }: CreateStoreProps<T>) => TStores<T>;


