
import * as baseRequest from 'request-promise-native';
import { RequestAPI, RequiredUriUrl } from 'request';
import { ObjectKeysSchema, validateSchema, objectSchema } from './validation';
import { RequestError } from './error';

type RequestTypes = 'get' | 'post' | 'put' | 'delete';

export interface IRequestManager {
    send<T>(options: baseRequest.Options, schema?: ObjectKeysSchema<T>): Promise<T>;
}

type PromiseRequestAPI = RequestAPI<baseRequest.RequestPromise<any>, baseRequest.RequestPromiseOptions, RequiredUriUrl>;

export class RequestManager implements IRequestManager {
    private static readonly DEFAULT_METHOD = 'get';

    private request: PromiseRequestAPI;

    constructor(request?: PromiseRequestAPI) {
        this.request = request || baseRequest.defaults({});
    }

    public async send<T>(options: baseRequest.Options, schema?: ObjectKeysSchema<T>): Promise<T> {
        const res = await this.request[this.getMethod(options)](options);
        return schema ? this.validateResponse(res, schema, options) : res;
    }

    private getMethod(options: baseRequest.Options): RequestTypes {
        return options.method ? options.method.toLowerCase() as RequestTypes : RequestManager.DEFAULT_METHOD;
    }

    private validateResponse<T>(res: any, schema: ObjectKeysSchema<T>, options: baseRequest.Options): T {
        const { obj, valid, error } = validateSchema<T>(res, objectSchema(schema));
        if (!valid) {
            throw new RequestError({
                error,
                request: options,
                response: obj,
                message: 'Response validation error'
            });
        }
        return obj;
    }
}