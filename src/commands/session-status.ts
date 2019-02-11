import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema, objectSchema } from "../lib/validation";
import { AccessLevel, IApiAdditionalAuth } from "./types";
import { schemaIApiAdditionalAuth } from "./types/validation";

export namespace SessionStatusCommand {
    export interface IRequestQuery extends ICommonQuery {
        sessionid: string;
    }

    export interface IPayload {
        accessLevel: AccessLevel;
        millisLeft?: number;
        userId: string;
        additionalAuth: IApiAdditionalAuth;
    }

    export interface IResponse extends ICommonResponse {
        payload: IPayload;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        payload: objectSchema<IPayload>({
            accessLevel: joi.string().required(),
            millisLeft: joi.number().optional(),
            userId: joi.string().required(),
            additionalAuth: schemaIApiAdditionalAuth.required()
        })
    };

    export const url: Readonly<string> = '/session_status';
    export const requiredSession: Readonly<boolean> = true;
}
