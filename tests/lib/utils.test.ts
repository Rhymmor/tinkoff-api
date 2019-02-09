import {isOk} from '../../src/lib/utils';

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
});