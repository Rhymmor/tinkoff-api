import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { ObjectKeysSchema } from "../lib/validation";

export namespace WarmupCacheCommand {
    export interface IRequestQuery extends ICommonQuery {
        sessionid: string;
    }
    export interface IRequestForm {
        wuid?: string;
    }
    export interface IResponse extends ICommonResponse {}

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse
    };

    export const url: Readonly<string> = '/warmup_cache';
    export const requiredSession: Readonly<boolean> = true;
    export const method = 'POST';
}