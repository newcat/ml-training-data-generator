export default class WrappedPromise<T> {

    public promise: Promise<T>;
    public resolve!: (data: T) => void;
    public reject!: (error: any) => void;

    public constructor() {
        this.promise = new Promise<T>((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }

}
