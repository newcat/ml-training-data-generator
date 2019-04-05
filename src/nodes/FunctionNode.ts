import { Node } from "@baklavajs/core";

const defaultValue = `return {
    output: this.input
};`;

export default class FunctionNode extends Node {

    public type = "FunctionNode";
    public name = this.type;

    // tslint:disable-next-line:ban-types
    private calcFunction: Function|null = null;

    constructor() {
        super();
        this.addOption("Edit Function", "ButtonOption", defaultValue, "FunctionSidebarOption");
        this.addInput("input");
        this.addOutput("output");
        this.hooks.load.tap(this, (state) => {
            Object.entries(state.customInterfaces).forEach(([name, data]) => {
                const d = data as any;
                if (d.isInput) {
                    this.addInputInterface(name, undefined, undefined, { type: "any", id: d.id });
                } else {
                    this.addOutputInterface(name, { type: "any", id: d.id });
                }
            });
            return state;
        });
        this.hooks.save.tap(this, (state) => {
            state.customInterfaces = {};
            this.interfaces.forEach((intf, name) => {
                state.customInterfaces[name] = { isInput: intf.isInput, id: intf.id };
            });
            return state;
        });
    }

    addInput(name: string) {
        this.addInputInterface(name, undefined, undefined, { type: "any" });
    }

    addOutput(name: string) {
        this.addOutputInterface(name, { type: "any" });
    }

    renameInterface(oldName: string, newName: string) {
        const intf = this.interfaces.get(oldName);
        if (intf) {
            this.interfaces.set(newName, intf);
            this.interfaces.delete(oldName);
            this.events.addInterface.emit(intf);
        }
    }

    removeInterface(name: string) {
        super.removeInterface(name);
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
            inputs[k] = this.interfaces.get(k)!.value;
        });
        const res = this.calcFunction.call(inputs);
        Object.keys(res).map((k) => {
            if (this.outputInterfaces[k]) {
                this.interfaces.get(k)!.value = res[k];
            }
        });
    }

}
