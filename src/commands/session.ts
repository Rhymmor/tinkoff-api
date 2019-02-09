import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema } from "../lib/validation";

export namespace SessionApi {
    export interface IRequestQuery extends ICommonQuery {}
    export interface IResponse extends ICommonResponse {
        payload: string;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        payload: joi.string().required()
    };

    export const url = '/session';
}
