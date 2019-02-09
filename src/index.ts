import { Options as RequestOptions } from 'request-promise-native';
import { ObjectKeysSchema, validateSchema } from './lib/validation';
import { SessionApi } from './commands/session';
import { IRequestError } from './lib/error';
import { IRequestManager, RequestManager } from './lib/request';
import { isOk } from './lib/utils';
import { schemaICommonErrorResponse, IApiCommand } from './commands/common';
import { SessionStatusApi } from './commands/session-status';

export class TinkoffApi {
    private static readonly BASE_URL = 'https://api.tinkoff.ru/v1';
    private static readonly ORIGIN = 'web,ib5,platform';

    private sessionId: string;
    private request: IRequestManager;

    constructor(requestManager?: IRequestManager) {
        this.request = requestManager || new RequestManager({
            baseUrl: TinkoffApi.BASE_URL,
            json: true,
        });
    }

    public async initializeSession(): Promise<SessionApi.IResponse> {
        const res = await this.sendCommand(SessionApi);
        if (res.resultCode !== 'OK') {
            const resError: IRequestError = {
                message: `Cannot get sessionid: result code is '${res.resultCode}'`,
                response: res
            };
            throw resError;
        }
        this.sessionId = res.payload;
        return res;
    }

    public async checkSessionStatus(sessionId?: string) {
        const actualSession = sessionId || this.sessionId;
        if (!isOk(actualSession)) {
            const resError: IRequestError = {
                message: `No session ID was provided'`
            };
            throw resError;
        }
        return await this.sendCommand(SessionStatusApi);
    }

    private makeRequest<T>(options: RequestOptions, schema?: ObjectKeysSchema<T>) {
        return this.request.send({
            ...options,
            qs: { ...options.qs, origin: TinkoffApi.ORIGIN }
        }, schema);
    }

    private sendCommand<T>(command: IApiCommand<T>, options?: RequestOptions) {
        return this.makeRequest({ ...options, url: command.url }, command.schemaIResponse);
    }
}