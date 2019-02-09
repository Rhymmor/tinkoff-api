import {validateSchema, joi, objectSchema} from '../../src/lib/validation';

describe('Validation utils function tests', () => {
    test('check validateSchema return type', () => {
        const validation = validateSchema({}, joi.object().optional());
        expect(validation).toHaveProperty('valid');
        expect(validation).toHaveProperty('obj');
        expect(validation).toHaveProperty('error');
        expect(validation).toHaveProperty('details');
    });

    test('check validateSchema positive cases', () => {
        expect(validateSchema(1, joi.number().required()).valid).toBe(true);
        expect(validateSchema({}, joi.object().required()).valid).toBe(true);
        expect(validateSchema(undefined, joi.any().optional()).valid).toBe(true);
    });

    test('check validateSchema negative cases', () => {
        expect(validateSchema('', joi.string().required()).valid).toBe(false);
        expect(validateSchema(null, joi.number().required()).valid).toBe(false);
    });

    test('check validateSchema returns same object', () => {
        expect(validateSchema({a: 1}, joi.object().required()).obj).toEqual({a: 1});
    });

    test('check validateSchema to fail on empty schema', () => {
        expect(() => validateSchema({}, null)).toThrow();
    });

    test('check objectSchema to fail on empty schema', () => {
        expect(() => objectSchema(null as any)).not.toThrow();
    });
});