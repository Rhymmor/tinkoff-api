import { SessionCommand } from './commands/session';
import { IRequestError } from './lib/error';
import { ResultCode } from './commands/types';
import { SessionStatusCommand } from './commands/session-status';
import { IApiCommandsManager, ApiCommandsManager } from './commands-manager';
import { SignUpCommand } from './commands/signup';

export class TinkoffApi {
    private sessionId: string | undefined;
    private api: IApiCommandsManager;

    constructor(apiManager?: IApiCommandsManager) {
        this.api = apiManager || new ApiCommandsManager();
    }

    public setSession(sessionId: string) {
        this.sessionId = sessionId;
    }

    public async initializeSession(): Promise<SessionCommand.IResponse> {
        const res = await this.api.send(SessionCommand);
        if (res.resultCode !== ResultCode.OK) {
            const resError: IRequestError = {
                message: `Cannot get sessionid: result code is '${res.resultCode}'`,
                response: res
            };
            throw resError;
        }
        this.setSession(res.payload);
        return res;
    }

    public async checkSessionStatus() {
        const query: SessionStatusCommand.IRequestQuery = { sessionid: this.sessionId! };
        return await this.api.send(SessionStatusCommand, { qs: query });
    }

    public async signUp(auth: SignUpCommand.IAuth) {
        const query: SignUpCommand.IRequestQuery = { ...auth, sessionid: this.sessionId! };
        await this.api.send(SignUpCommand, {qs: query});
    }
}