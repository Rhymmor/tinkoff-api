
export type UseKeys<K, T> = {
    [keys in keyof K]: T;
};
