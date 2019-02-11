import { IRequestManager, RequestManager } from "./lib/request";
import { ObjectKeysSchema } from "./lib/validation";
import { IApiCommand, ICommonQuery } from "./commands/common";
import {
    Options as RequestUrlOptions,
    RequestPromiseOptions as RequestOptions,
    defaults as requestDefaults
} from 'request-promise-native';
import { isOk } from "./lib/utils";
import { IRequestError } from "./lib/error";

export interface IApiCommandsManager {
    send<T>(command: IApiCommand<T>, options?: RequestOptions): Promise<T>;
}

interface IApiRequestOptions extends RequestOptions {
    qs: ICommonQuery;
}

export class ApiCommandsManager implements IApiCommandsManager {
    private static readonly BASE_URL = 'https://api.tinkoff.ru/v1';
    private static readonly ORIGIN = 'web,ib5,platform';

    private request: IRequestManager;

    constructor(requestManager?: IRequestManager) {
        this.request = requestManager || new RequestManager(requestDefaults({
            baseUrl: ApiCommandsManager.BASE_URL,
            json: true,
        }));
    }



    public async send<T>(command: IApiCommand<T>, options?: IApiRequestOptions) {
        if (command.requiredSession && (!options || !isOk(options.qs.sessionid))) {
            const resError: IRequestError = {
                message: `No session ID was provided`
            };
            throw resError;
        }
        return await this.makeRequest({ ...options, url: command.url }, command.schemaIResponse);
    }

    private makeRequest<T>(options: RequestUrlOptions, schema?: ObjectKeysSchema<T>) {
        return this.request.send({
            ...options,
            qs: { ...options.qs, origin: ApiCommandsManager.ORIGIN }
        }, schema);
    }
}