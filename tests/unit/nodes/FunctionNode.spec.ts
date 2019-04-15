import { expect } from "chai";
import FunctionNode from "@/nodes/FunctionNode";

describe("FunctionNode", () => {

    it("can add an input interface", () => {
        const n = new FunctionNode();
        n.addInput("testinput");
        expect(n.interfaces.has("testinput")).to.be.true;
        expect(n.getInterface("testinput").isInput).to.be.true;
    });

    it("can add an output interface", () => {
        const n = new FunctionNode();
        n.addOutput("testoutput");
        expect(n.interfaces.has("testoutput")).to.be.true;
        expect(n.getInterface("testoutput").isInput).to.be.false;
    });

    it("can remove an interface", () => {
        const n = new FunctionNode();
        expect(n.interfaces.has("input")).to.be.true;
        n.removeInterface("input");
        expect(n.interfaces.has("input")).to.be.false;
    });

    it("can rename an interface", () => {
        const n = new FunctionNode();
        const oldIntf = n.getInterface("input")!;
        n.renameInterface("input", "newName");
        expect(n.getInterface("newName")).to.equal(oldIntf);
    });

    it("correctly runs the provided function", () => {
        const n = new FunctionNode();
        n.prepare();
        n.getInterface("input").value = "myValue";
        n.calculate();
        expect(n.getInterface("output").value).to.equal("myValue");
    });

    it("correctly saves and loads a state", () => {
        const n = new FunctionNode();
        n.removeInterface("input");
        n.removeInterface("output");
        n.addInput("newInput");
        n.addOutput("newOutput");
        n.setOptionValue("Edit Function", "return { newOutput: this.newInput }");
        const state = n.save();
        const n2 = new FunctionNode();
        n2.load(state);
        expect(Array.from(n2.interfaces)).to.have.lengthOf(2);
        expect(n2.getInterface("newInput")).to.include({
            id: n.getInterface("newInput").id,
            isInput: true
        });
        expect(n2.getInterface("newOutput")).to.include({
            id: n.getInterface("newOutput").id,
            isInput: false
        });
    });

});
