import { SessionCommand } from './commands/session';
import { ResultCode, ApiOperation } from './commands/types';
import { SessionStatusCommand } from './commands/session-status';
import { IApiCommandsManager, ApiCommandsManager } from './modules/commands-manager';
import { SignUpCommand } from './commands/signup';
import { RequestError } from './lib/error';
import { ConfirmCommand } from './commands/confirm';

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
        // Actually, GET request with auth params in query also works. That's kinda strange
        const query: SignUpCommand.IRequestQuery = { sessionid: this.sessionId! };
        return await this.api.send(SignUpCommand, {qs: query, form: auth});
    }

    public async confirm(operation: string, operationTicket: string, smsId: string | number) {
        const query: ConfirmCommand.IRequestQuery = { sessionid: this.sessionId! };
        const formData: ConfirmCommand.IRequestForm = {
            initialOperation: operation,
            initialOperationTicket: operationTicket,
            confirmationData: JSON.stringify({SMSBYID: smsId})
        };
        return await this.api.send(ConfirmCommand, {qs: query, form: formData});
    }

    public confirmSignUp(operationTicket: string, smsId: string) {
        return this.confirm(ApiOperation.SIGN_UP, operationTicket, smsId);
    }
}