import { Node, Options } from "baklavajs";
import FunctionSidebarOption from "./CodeOption.vue";
import { INodeState, IInterfaceState } from 'baklavajs/dist/model/state';

interface IExtendedInterfaceState extends IInterfaceState {
    isInput: boolean;
}

export default class FunctionNode extends Node {

    public type = "FunctionNode";
    public name = this.type;

    // tslint:disable-next-line:ban-types
    private calcFunction: Function|null = null;

    constructor() {
        super();
        this.addOption("Edit Function", Options.ButtonOption, "a = b + c", FunctionSidebarOption);
    }

    addInput(name: string) {
        this.addInputInterface(name, "any");
    }

    addOutput(name: string) {
        this.addOutputInterface(name, "any");
    }

    removeInterface(name: string) {
        super.removeInterface(name);
    }

    public load(state: INodeState) {
        Object.keys(state.interfaces).forEach((k) => {
            if ((state.interfaces[k] as IExtendedInterfaceState).isInput) {
                this.addInputInterface(k, "any");
            } else {
                this.addOutputInterface(k, "any");
            }
        });
        super.load(state);
    }

    public save(): INodeState {
        const s = super.save();
        Object.keys(s.interfaces).forEach((i) => {
            (s.interfaces[i] as IExtendedInterfaceState).isInput = this.interfaces[i].isInput;
        });
        return s;
    }

    prepare() {
        const code = this.getOptionValue("Edit Function");
        this.calcFunction = new Function(code);
    }

    calculate() {
        if (!this.calcFunction) {
            return;
        }
        const inputs: Record<string, any> = {};
        Object.keys(this.inputInterfaces).forEach((k) => {
            inputs[k] = this.interfaces[k].value;
        });
        const res = this.calcFunction.call(inputs);
        Object.keys(res).map((k) => {
            if (this.outputInterfaces[k]) {
                this.interfaces[k].value = res[k];
            }
        });
    }

}
