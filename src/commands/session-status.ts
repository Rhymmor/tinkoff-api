import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse, AccessLevel } from "./common";
import { joi, ObjectKeysSchema, objectSchema } from "../lib/validation";

export namespace SessionStatusApi {
    export interface IRequestQuery extends ICommonQuery {
        sessionid: string;
    }

    export interface IPayload {
        accessLevel: AccessLevel;
        millisLeft?: number;
        userId: string;
    }

    export interface IResponse extends ICommonResponse {
        payload: IPayload;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        payload: objectSchema<IPayload>({
            accessLevel: joi.string().required(),
            millisLeft: joi.number().optional(),
            userId: joi.string().required()
        })
    };

    export const url = '/session_status';
}
