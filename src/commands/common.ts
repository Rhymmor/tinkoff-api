import { ObjectKeysSchema, joi, objectSchema } from "../lib/validation";

export interface IApiCommand<T> {
    url: string;
    schemaIResponse?: ObjectKeysSchema<T>;
}

export enum KnownResultCode {
    OK = 'OK',
    WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
    SESSION_IS_ABSENT = 'SESSION_IS_ABSENT',
    INSUFFICIENT_PRIVILEGES = 'INSUFFICIENT_PRIVILEGES'
}

export enum AccessLevel {
    CANDIDATE = 'CANDIDATE',
    CLIENT = 'CLIENT',
    ANONYMOUS = 'ANONYMOUS'
}

export interface ICommonResponse {
    resultCode: KnownResultCode | string;
    trackingId: string;
}

export interface ICommonErrorResponse extends ICommonResponse {
    errorMessage: string;
    plainMessage?: string;
}

export interface ICommonQuery {
    origin: string;
    sessionid?: string;
    wuid?: string;
}

export const schemaKeysICommonResponse: ObjectKeysSchema<ICommonResponse> = {
    resultCode: joi.string().required(),
    trackingId: joi.string().required()
};

const schemaKeysICommonErrorResponse: ObjectKeysSchema<ICommonErrorResponse> = {
    ...schemaKeysICommonResponse,
    errorMessage: joi.string().required(),
    plainMessage: joi.string().optional()
};

export const schemaICommonErrorResponse = objectSchema<ICommonErrorResponse>(schemaKeysICommonErrorResponse);