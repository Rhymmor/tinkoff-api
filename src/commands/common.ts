import { ObjectKeysSchema, joi, objectSchema } from "../lib/validation";
import { ResultCode } from "./types";

export interface IApiCommand<T> {
    url: Readonly<string>;
    schemaIResponse?: ObjectKeysSchema<T>;
    requiredSession: Readonly<boolean>;
}

export interface ICommonResponse {
    resultCode: ResultCode | string;
    trackingId: string;
}

export interface ICommonErrorResponse extends ICommonResponse {
    errorMessage: string;
    plainMessage?: string;
}

export interface ICommonQuery {
    origin?: string;
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