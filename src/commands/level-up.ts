import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema, objectSchema } from "../lib/validation";
import { AccessLevel } from "./types";

export namespace LevelUpCommand {
    interface IPayload {
        accessLevel: AccessLevel | string;
    }

    export interface IRequestQuery extends ICommonQuery {}
    export interface IResponse extends ICommonResponse {
        payload: IPayload;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        payload: objectSchema<IPayload>({
            accessLevel: joi.string().required()
        })
    };

    export const url: Readonly<string> = '/level_up';
    export const requiredSession: Readonly<boolean> = true;
    export const method = 'POST';
}