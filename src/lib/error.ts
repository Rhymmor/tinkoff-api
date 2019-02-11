
interface IRequestErrorProps<Req = any, Res = any> {
    message: string;
    request?: Req;
    response?: Res;
    error?: any;
}

export class RequestError extends Error {
    public props: IRequestErrorProps;

    constructor(props: IRequestErrorProps) {
        super(props.message);
        this.name = this.constructor.name;
        this.props = props;
        Error.captureStackTrace(this, RequestError);
    }
}