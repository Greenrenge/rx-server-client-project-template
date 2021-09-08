export interface StoreEntity<T> {
   readonly id: string;
   readonly value: T | null;
}

export interface StoreDto<T> {
   readonly [key: string]: T;
}

export interface StoresDto {
   readonly [key: string]: StoreDto<unknown>;
}
