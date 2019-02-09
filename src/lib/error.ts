
export interface IRequestError<T = any> {
    message: string;
    response?: T;
    error?: any;
}