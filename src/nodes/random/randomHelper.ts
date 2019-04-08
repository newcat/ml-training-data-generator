import chance from "chance";

export interface IUniformParams {
    fixed?: number;
    min?: number;
    max?: number;
}

export interface INormalParams {
    mean?: number;
    dev?: number;
}

export default class RandomHelper {

    private randomInstance = new chance();
    private seed: string;
    private discrete: boolean;

    public constructor(seed: string, discrete: boolean) {
        this.seed = seed;
        this.discrete = discrete;
        if (this.seed) {
            this.randomInstance = new chance(this.seed);
        }
    }

    public uniform(index?: number, params?: IUniformParams) {
        return this.finalize(this.rng(index).floating(params));
    }

    public normal(index?: number, params?: INormalParams) {
        return this.finalize(this.rng(index).normal(params));
    }

    private rng(index?: number) {
        if (this.seed && index !== undefined) {
            return new chance(this.seed + index);
        } else {
            return this.randomInstance;
        }
    }

    private finalize(value: number) {
        return this.discrete ? Math.round(value) : value;
    }

}
