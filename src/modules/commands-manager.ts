import { IRequestManager, RequestManager } from "../lib/request";
import { ObjectKeysSchema, isValidationError } from "../lib/validation";
import { IApiCommand, ICommonQuery, isApiErrorResponse } from "../commands/common";
import {
    Options as RequestUrlOptions,
    RequestPromiseOptions as RequestOptions,
    defaults as requestDefaults
} from 'request-promise-native';
import { isOk } from "../lib/utils";
import { RequestError } from "../lib/error";

export interface IApiCommandsManager {
    send<T>(command: IApiCommand<T>, options?: RequestOptions): Promise<T>;
}

interface IApiRequestOptions extends RequestOptions {
    qs?: ICommonQuery;
}

interface IApiUrlRequestOptions extends IApiRequestOptions {
    url: string;
}

export class ApiCommandsManager implements IApiCommandsManager {
    private static readonly BASE_URL = 'https://api.tinkoff.ru/v1';
    private static readonly ORIGIN = 'web,ib5,platform';
    private static readonly DEFAULT_METHOD = 'GET';

    private request: IRequestManager;

    constructor(requestManager?: IRequestManager) {
        this.request = requestManager || new RequestManager(requestDefaults({
            baseUrl: ApiCommandsManager.BASE_URL,
            json: true,
        }));
    }

    public async send<T>(command: IApiCommand<T>, options?: IApiRequestOptions) {
        const urlOptions: IApiUrlRequestOptions = {
            ...options,
            url: command.url,
            method: command.method || ApiCommandsManager.DEFAULT_METHOD
        };
        if (command.requiredSession) {
            this.throwOnMissingSession(urlOptions);
        }
        try {
            return await this.makeRequest(urlOptions, command.schemaIResponse);
        } catch (e) {
            if (e instanceof RequestError) {
                this.throwOnApiError(e, urlOptions);
            }
            throw e;
        }
    }

    private makeRequest<T>(options: RequestUrlOptions, schema?: ObjectKeysSchema<T>) {
        return this.request.send({
            ...options,
            qs: { ...options.qs, origin: ApiCommandsManager.ORIGIN }
        }, schema);
    }

    private throwOnApiError(err: RequestError, options: IApiUrlRequestOptions) {
        if (isValidationError(err.props.error) && isApiErrorResponse(err.props.response)) {
            throw new RequestError({
                message: `Got error response from '${options.url}'`,
                request: options,
                response: err.props.response
            });
        }
    }

    private throwOnMissingSession(options?: IApiRequestOptions | IApiUrlRequestOptions) {
        if (!isOk(options) || !isOk(options.qs) || !isOk(options.qs.sessionid)) {
            throw new RequestError({
                message: `No session ID was provided`,
                request: options
            });
        }
    }
}