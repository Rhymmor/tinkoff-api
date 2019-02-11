
export function isOk<T>(obj: T | undefined | null): obj is T {
    return obj !== undefined && obj !== null;
}

export function safeGet<TSrc, TResult>(source: TSrc, mapFunc: (v: TSrc) => TResult, defaultVal?: TResult) {
    try {
        const res = mapFunc(source);
        return res !== undefined ? res : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}