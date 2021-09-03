import {Store} from './store';

export interface StoreEntity<T> {
   readonly id: string;
   readonly value: T | null;
}

export interface StoreData<T> {
   readonly [key: string]: T;
}

export interface Stores {
   [key: string]: Store<unknown>;
}
