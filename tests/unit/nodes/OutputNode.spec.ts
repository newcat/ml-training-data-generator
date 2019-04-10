import { expect } from "chai";
import OutputNode from "@/nodes/OutputNode";

describe("OutputNode", () => {

    it("correctly sets the state when calculating", () => {
        const n = new OutputNode();
        n.getInterface("Input").value = "Test";
        n.calculate();
        expect(n.state.result).to.equal("Test");
    });

});
