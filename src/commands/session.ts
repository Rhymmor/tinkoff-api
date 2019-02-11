import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema } from "../lib/validation";

export namespace SessionCommand {
    export interface IRequestQuery extends ICommonQuery {}
    export interface IResponse extends ICommonResponse {
        payload: string;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        payload: joi.string().required()
    };

    export const url: Readonly<string> = '/session';
    export const requiredSession: Readonly<boolean> = false;
}