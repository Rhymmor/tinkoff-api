import { SessionApi } from './commands/session';
import { IRequestError } from './lib/error';
import { isOk } from './lib/utils';
import { ResultCode } from './commands/common';
import { SessionStatusApi } from './commands/session-status';
import { IApiCommandsManager, ApiCommandsManager } from './commands-manager';

export class TinkoffApi {
    private sessionId: string | undefined;
    private api: IApiCommandsManager;

    constructor(apiManager?: IApiCommandsManager) {
        this.api = apiManager || new ApiCommandsManager();
    }

    public async initializeSession(): Promise<SessionApi.IResponse> {
        const res = await this.api.send(SessionApi);
        if (res.resultCode !== ResultCode.OK) {
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
        const query: SessionStatusApi.IRequestQuery = { sessionid: actualSession };
        return await this.api.send(SessionStatusApi, { qs: query });
    }
}