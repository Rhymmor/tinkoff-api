import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema, objectSchema } from "../lib/validation";
import { AccessLevel, IApiAdditionalAuth } from "./types";
import { schemaIApiAdditionalAuth } from "./types/validation";

export namespace ConfirmCommand {
    interface IPayload {
        sessionid: string;
        accessLevel: AccessLevel;
        sessionTimeout?: number;
        additionalAuth?: IApiAdditionalAuth;
        userId?: string;
        newUser?: boolean;
        login?: string;
    }

    export interface IRequestQuery extends ICommonQuery {}
    export interface IRequestForm {
        initialOperationTicket: string;
        initialOperation: string;
        confirmationData: string;
    }

    export interface IResponse extends ICommonResponse {
        payload: IPayload;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        payload: objectSchema({
            sessionid: joi.string().required(),
            accessLevel: joi.string().required(),
            sessionTimeout: joi.number().optional(),
            additionalAuth: schemaIApiAdditionalAuth.optional(),
            userId: joi.string().optional(),
            newUser: joi.boolean().optional(),
            login: joi.string().optional(),
        }).required()
    };

    export const url: Readonly<string> = '/confirm';
    export const requiredSession: Readonly<boolean> = true;
    export const method: Readonly<string> = 'POST';
}