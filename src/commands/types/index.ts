
export enum ResultCode {
    OK = 'OK',
    WAITING_CONFIRMATION = 'WAITING_CONFIRMATION',
    SESSION_IS_ABSENT = 'SESSION_IS_ABSENT',
    INSUFFICIENT_PRIVILEGES = 'INSUFFICIENT_PRIVILEGES',
    CONFIRMATION_FAILED = 'CONFIRMATION_FAILED',
    INVALID_REQUEST_DATA = 'INVALID_REQUEST_DATA'
}

export enum AccessLevel {
    CANDIDATE = 'CANDIDATE',
    CLIENT = 'CLIENT',
    ANONYMOUS = 'ANONYMOUS'
}

export enum ApiOperation {
    SIGN_UP = 'sign_up'
}

export interface IApiAdditionalAuth {
    needLogin?: boolean;
    needPassword?: boolean;
    needRegister?: boolean;
}