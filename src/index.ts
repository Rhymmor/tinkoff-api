import { SessionCommand } from './commands/session';
import { ResultCode, ApiOperation } from './commands/types';
import { SessionStatusCommand } from './commands/session-status';
import { IApiCommandsManager, ApiCommandsManager } from './modules/commands-manager';
import { SignUpCommand } from './commands/signup';
import { RequestError } from './lib/error';
import { ConfirmCommand } from './commands/confirm';
import { LevelUpCommand } from './commands/level-up';
import { WarmupCacheCommand } from './commands/warmup-cache';
import { RequestPromiseOptions } from 'request-promise';
import { isOk, safeGet } from './lib/utils';
import { IApiCommand, ICommonQuery } from './commands/common';

export class TinkoffApi {
    private sessionId: string | undefined;
    private sender: IApiCommandsManager;

    constructor(commandsManager?: IApiCommandsManager) {
        this.sender = commandsManager || new ApiCommandsManager();
    }

    public setSession(sessionId: string) {
        this.sessionId = sessionId;
    }

    public async initializeSession(): Promise<SessionCommand.IResponse> {
        const res = await this.sender.send(SessionCommand);
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
        return await this.sendCommand(SessionStatusCommand);
    }

    public async signUp(auth: SignUpCommand.IAuth) {
        // Actually, GET request with auth params in query also works. That's kinda strange
        return await this.sendCommand(SignUpCommand, {form: auth});
    }

    public async confirm(operation: string, operationTicket: string, smsId: string | number) {
        const formData: ConfirmCommand.IRequestForm = {
            initialOperation: operation,
            initialOperationTicket: operationTicket,
            confirmationData: JSON.stringify({SMSBYID: smsId})
        };
        return await this.sendCommand(ConfirmCommand, {form: formData});
    }

    public confirmSignUp(operationTicket: string, smsId: string) {
        return this.confirm(ApiOperation.SIGN_UP, operationTicket, smsId);
    }

    public levelUp() {
        return this.sendCommand(LevelUpCommand);
    }

    public warmUpCache(wuid?: string) {
        const options: RequestPromiseOptions = {};
        if (isOk(wuid)) {
            options.form = {wuid};
        }
        return this.sendCommand(WarmupCacheCommand, options);
    }

    private sendCommand<T>(command: IApiCommand<T>, options?: RequestPromiseOptions) {
        const query: ICommonQuery = {
            ...safeGet(options, x => x!.qs),
            sessionid: this.sessionId!
        };
        const commandOptions = {...options, qs: query};
        return this.sender.send(command, commandOptions);
    }
}