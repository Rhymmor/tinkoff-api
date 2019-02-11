import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema, objectSchema } from "../lib/validation";
import { AccessLevel, IApiAdditionalAuth } from "./types";

export namespace SessionStatusApi {
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

    export const url = '/session_status';
}
