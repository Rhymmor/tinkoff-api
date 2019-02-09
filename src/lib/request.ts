
import * as baseRequest from 'request-promise-native';
import { RequestAPI, RequiredUriUrl } from 'request';
import { ObjectKeysSchema, validateSchema, objectSchema } from './validation';
import { IRequestError } from './error';

type RequestTypes = 'get' | 'post' | 'put' | 'delete';

export interface IRequestManager {
    send<T>(options: baseRequest.Options, schema?: ObjectKeysSchema<T>): Promise<T>;
}

export class RequestManager implements IRequestManager {
    private static readonly DEFAULT_METHOD = 'get';

    private request: RequestAPI<baseRequest.RequestPromise<any>, baseRequest.RequestPromiseOptions, RequiredUriUrl>;

    constructor(defaultOptions?: baseRequest.RequestPromiseOptions) {
        this.request = baseRequest.defaults(defaultOptions || {});
    }

    public async send<T>(options: baseRequest.Options, schema?: ObjectKeysSchema<T>): Promise<T> {
        const res = await this.request[this.getMethod(options)](options);
        return schema ? this.validateResponse(res, schema) : res;
    }

    private getMethod(options: baseRequest.Options): RequestTypes {
        return options.method ? options.method.toLowerCase() as RequestTypes : RequestManager.DEFAULT_METHOD;
    }

    private validateResponse<T>(res: any, schema: ObjectKeysSchema<T>): T {
        const { obj, valid, error } = validateSchema<T>(res, objectSchema(schema));
        if (!valid) {
            const resError: IRequestError = { error, response: obj, message: 'Response validation error' };
            throw resError;
        }
        return obj;
    }
}