import { SessionCommand } from './commands/session';
import { ResultCode, ApiOperation } from './commands/types';
import { ResultCode } from './commands/types';
import { SessionStatusCommand } from './commands/session-status';
import { IApiCommandsManager, ApiCommandsManager } from './commands-manager';
import { SignUpCommand } from './commands/signup';
import { RequestError } from './lib/error';

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
            throw new RequestError({
                message: `Cannot get sessionid: result code is '${res.resultCode}'`,
                response: res
            });
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