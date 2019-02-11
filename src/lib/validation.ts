import * as joi from 'joi';
import { UseKeys } from './util-types';
import { isOk } from './utils';

export type ObjectKeysSchema<T> = Required<UseKeys<T, joi.Schema>>;

export interface IValidationResult<T> {
    valid: boolean;
    error: joi.ValidationError | null;
    details: string;
    obj: T;
}

export function objectSchema<T>(keys: Required<UseKeys<T, joi.Schema>>, allowUnknown = true) {
    return joi.object().keys(keys).options({ allowUnknown });
}

export function validateSchema<T>(obj: any, schema: joi.SchemaLike): IValidationResult<T> {
    const res = joi.validate(obj, schema);
    const formattedError = (res.error === null) ? '' : formatValidationError(res.error);
    return {
        valid: (res.error === null),
        details: formattedError,
        error: res.error,
        obj: res.value,
    };
}

function formatValidationError(error: joi.ValidationError): string {
    return error.details.map(err => `${err.path}: ${err.message}`).join(', ');
}

export function isValidationError(e: any): e is joi.ValidationError {
    return isOk(e) && !!e.isJoi && e.name === 'ValidationError';
}

export { joi };
