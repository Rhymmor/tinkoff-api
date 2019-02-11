import {isOk, safeGet} from '../../src/lib/utils';

describe('Utils function tests', () => {
    test('isOk with positive check', () => {
        expect(isOk({})).toBe(true);
        expect(isOk('')).toBe(true);
        expect(isOk(0)).toBe(true);
        expect(isOk('null')).toBe(true);
        expect(isOk('undefined')).toBe(true);
    });

    test('isOk with negative check', () => {
        expect(isOk(undefined)).toBe(false);
        expect(isOk(null)).toBe(false);
    });

    test("safeGet function doesn't fail", () => {
        expect(safeGet({a: 1}, x => x.a)).toBe(1);
        expect(safeGet(null, (x: any) => x.a.b.c)).toBe(undefined);
        expect(safeGet(undefined, (x: any) => x.a.b.c)).toBe(undefined);
    });

    test("safeGet function gets default value", () => {
        expect(safeGet(null, (x: any) => x.a.b.c, 1)).toBe(1);
        expect(safeGet(undefined, (x: any) => x.a.b.c, 2)).toBe(2);

        const obj: {a?: number} = {a: undefined};
        expect(safeGet(obj, x => x.a, 2)).toBe(2);
    });
});