
export enum ResultCode {
    OK = 'OK',
    WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
    SESSION_IS_ABSENT = 'SESSION_IS_ABSENT',
    INSUFFICIENT_PRIVILEGES = 'INSUFFICIENT_PRIVILEGES'
}

export enum AccessLevel {
    CANDIDATE = 'CANDIDATE',
    CLIENT = 'CLIENT',
    ANONYMOUS = 'ANONYMOUS'
}

export interface IApiAdditionalAuth {
    needLogin: boolean;
    needPassword: boolean;
    needRegister: boolean;
}