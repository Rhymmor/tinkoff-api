import { ICommonQuery, ICommonResponse, schemaKeysICommonResponse } from "./common";
import { joi, ObjectKeysSchema } from "../lib/validation";

export namespace SignUpCommand {
    interface IAuthPhone {
        phone: string;
    }
    interface IAuthCredentials {
        username: string;
        password: string;
    }
    export type IAuth = IAuthPhone | IAuthCredentials;

    export type IRequestQuery = ICommonQuery;
    export type IRequestForm = IAuth;

    export interface IResponse extends ICommonResponse {
        operationTicket: string;
        initialOperation?: string;
        confirmations: string[];
        // TODO: add strict type
        confirmationData: Record<string, object>;
    }

    export const schemaIResponse: ObjectKeysSchema<IResponse> = {
        ...schemaKeysICommonResponse,
        operationTicket: joi.string().required(),
        initialOperation: joi.string().optional(),
        confirmations: joi.array().items(joi.string().required()).required(),
        confirmationData: joi.any().optional()
    };

    export const url: Readonly<string> = '/sign_up';
    export const requiredSession: Readonly<boolean> = true;
    export const method = 'POST';
}
