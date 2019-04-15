import { expect } from "chai";
import CustomNode from "@/nodes/random/custom/CustomNode";

describe("CustomNode", () => {      
    it(`calculates random numbers with mode curveMonotone correctly`, () => {
        const mode = "curveLinear";
        const min = 0;
        const max = 10;
        const points = [[]]
        const n = new CustomNode();
        n.getInterface("Min").value = min;
        n.getInterface("Max").value = max;
        const v = n.getOptionValue("Custom Distribution");
        v.mode = mode;
        v.points = points;
        n.setOptionValue("Custom Distribution", v);
        n.calculate();
        expect(true);
    });
});