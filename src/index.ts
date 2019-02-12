import { SessionCommand } from './commands/session';
import { ResultCode, ApiOperation } from './commands/types';
import { SessionStatusCommand } from './commands/session-status';
import { IApiCommandsManager, ApiCommandsManager } from './modules/commands-manager';
import { SignUpCommand } from './commands/signup';
import { RequestError } from './lib/error';
import { ConfirmCommand } from './commands/confirm';
import { LevelUpCommand } from './commands/level-up';
import { WarmupCacheCommand } from './commands/warmup-cache';
import { RequestPromiseOptions } from 'request-promise-native';
import { isOk } from './lib/utils';
import { IApiCommand } from './commands/common';
import { OperationsCommand } from './commands/operations';

export class TinkoffApi {
    private sender: IApiCommandsManager;

    constructor(commandsManager?: IApiCommandsManager) {
        this.sender = commandsManager || new ApiCommandsManager();
    }

    public async initializeSession(): Promise<SessionCommand.IResponse> {
        const res = await this.sender.send(SessionCommand);
        if (res.resultCode !== ResultCode.OK) {
            throw new RequestError({
                message: `Cannot get sessionid: result code is '${res.resultCode}'`,
                response: res
            });
        }
        return res;
    }

    public async checkSessionStatus(sessionId: string) {
        const query: SessionStatusCommand.IRequestQuery = {sessionid: sessionId};
        return await this.sendCommand(SessionStatusCommand, {qs: query});
    }

    public async signUp(sessionId: string, auth: SignUpCommand.IAuth) {
        const query: SignUpCommand.IRequestQuery = {sessionid: sessionId};
        // Actually, GET request with auth params in query also works. That's kinda strange
        return await this.sendCommand(SignUpCommand, {form: auth, qs: query});
    }

    public async confirm(sessionId: string, operation: string, operationTicket: string, smsId: string | number) {
        const query: ConfirmCommand.IRequestQuery = {sessionid: sessionId};
        const formData: ConfirmCommand.IRequestForm = {
            initialOperation: operation,
            initialOperationTicket: operationTicket,
            confirmationData: JSON.stringify({SMSBYID: smsId})
        };
        return await this.sendCommand(ConfirmCommand, {form: formData, qs: query});
    }

    public confirmSignUp(sessionId: string, operationTicket: string, smsId: string) {
        return this.confirm(sessionId, ApiOperation.SIGN_UP, operationTicket, smsId);
    }

    public levelUp(sessionId: string) {
        const query: LevelUpCommand.IRequestQuery = {sessionid: sessionId};
        return this.sendCommand(LevelUpCommand, {qs: query});
    }

    public warmUpCache(sessionId: string, wuid?: string) {
        const query: WarmupCacheCommand.IRequestQuery = {sessionid: sessionId};
        const options: RequestPromiseOptions = {qs: query};
        if (isOk(wuid)) {
            options.form = {wuid};
        }
        return this.sendCommand(WarmupCacheCommand, options);
    }

    public getOperations(sessionId: string, from = new Date(0), to = new Date()) {
        const query: OperationsCommand.IRequestQuery = {
            sessionid: sessionId,
            start: Number(from),
            end: Number(to)
        };
        return this.sendCommand(OperationsCommand, {qs: query});
    }

    private sendCommand<T>(command: IApiCommand<T>, options?: RequestPromiseOptions) {
        return this.sender.send(command, options);
    }
}