import { expect } from "chai";
import MathNode from "@/nodes/MathNode";

const tests = [
    ["Add", 1, 1, 2],
    ["Subtract", 1, 1, 0],
    ["Multiply", 5, 5, 25],
    ["Divide", 10, 5, 2],
    ["Sine", 2, 0, Math.sin(2)],
    ["Cosine", 2, 0, Math.cos(2)],
    ["Tangent", 2, 0, Math.tan(2)],
    ["Arcsine", 0.5, 0, Math.asin(0.5)],
    ["Arccosine", 0.5, 0, Math.acos(0.5)],
    ["Arctangent", 0.5, 0, Math.atan(0.5)],
    ["Power", 2, 2, 4],
    ["Logarithm", 4, 2, 2],
    ["Minimum", 2, 4, 2],
    ["Maximum", 2, 4, 4],
    ["Round", 4.3, 0, 4],
    ["Round", 4.7, 0, 5],
    ["Modulo", 7, 3, 1],
    ["Absolute", -1, 0, 1]
] as Array<[string, number, number, number]>;

describe("MathNode", () => {

    tests.forEach(([op, val1, val2, expected]) => {
        it(`performs the operation '${op}' correctly`, () => {
            const n = new MathNode();
            n.getInterface("Value 1").value = val1;
            n.getInterface("Value 2").value = val2;
            const v = n.getOptionValue("Operation");
            v.selected = op;
            n.setOptionValue("Operation", v);
            n.calculate();
            expect(n.getInterface("Result").value).to.equal(expected);
        });
    });

});
