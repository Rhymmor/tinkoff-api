import { IRequestManager, RequestManager } from "./lib/request";
import { ObjectKeysSchema } from "./lib/validation";
import { IApiCommand } from "./commands/common";
import { Options as RequestUrlOptions, RequestPromiseOptions as RequestOptions } from 'request-promise-native';

export interface IApiCommandsManager {
    send<T>(command: IApiCommand<T>, options?: RequestOptions): Promise<T>;
}

export class ApiCommandsManager implements IApiCommandsManager {
    private static readonly BASE_URL = 'https://api.tinkoff.ru/v1';
    private static readonly ORIGIN = 'web,ib5,platform';

    private request: IRequestManager;

    constructor(requestManager?: IRequestManager) {
        this.request = requestManager || new RequestManager({
            baseUrl: ApiCommandsManager.BASE_URL,
            json: true,
        });
    }

    public send<T>(command: IApiCommand<T>, options?: RequestOptions) {
        return this.makeRequest({ ...options, url: command.url }, command.schemaIResponse);
    }

    private makeRequest<T>(options: RequestUrlOptions, schema?: ObjectKeysSchema<T>) {
        return this.request.send({
            ...options,
            qs: { ...options.qs, origin: ApiCommandsManager.ORIGIN }
        }, schema);
    }
}