
export interface IRequestError<Req = any, Res = any> {
    message: string;
    request?: Req;
    response?: Res;
    error?: any;
}