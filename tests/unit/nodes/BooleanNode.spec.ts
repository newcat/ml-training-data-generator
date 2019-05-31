import { expect } from "chai";
import BooleanNode from "@/nodes/BooleanNode";

function getNode(val1: number, val2: number, operation: string, useInt: boolean) {
    const b = new BooleanNode();
    b.getInterface("Value 1").value = val1;
    b.getInterface("Value 2").value = val2;
    b.getInterface("Round Values").value = useInt;
    const v = b.getOptionValue("Operation");
    v.selected = operation;
    b.setOptionValue("Operation", v);
    b.calculate();
    return b;
}

// test format: [val1, val2, useInt, expected]
type TestType = [number, number, boolean, boolean];
const tests = [
    {
        operation: "==",
        tests: [
            [0.5, 0.5, false, true],
            [1, 1.1, true, true],
            [0.4, 0.5, false, false],
            [2, 1.1, false, false]
        ]
    },
    {
        operation: ">",
        tests: [
            [0.7, 0, false, true],
            [0.7, 0, true, true],
            [0.4, 0.5, false, false],
            [1.4, 1, true, false]
        ]
    },
    {
        operation: "<",
        tests: [
            [0, 0.7, false, true],
            [0, 0.7, true, true],
            [0.5, 0.4, false, false],
            [1, 1.4, true, false]
        ]
    },
    {
        operation: ">=",
        tests: [
            [0.7, 0, false, true],
            [0.7, 0, true, true],
            [1.4, 1, true, true],
            [0.4, 0.5, false, false]
        ]
    },
    {
        operation: "<=",
        tests: [
            [0, 0.7, false, true],
            [0, 0.7, true, true],
            [1, 1.4, true, true],
            [0.5, 0.4, false, false]
        ]
    }
] as Array<{ operation: string, tests: TestType[] }>;

describe("BooleanNode", () => {

    it("can invert the output", () => {
        const n1 = getNode(0.5, 0.5, "==", false);
        expect(n1.getInterface("Result").value).to.be.true;
        n1.getInterface("Invert Output").value = true;
        n1.calculate();
        expect(n1.getInterface("Result").value).to.be.false;
    });

    tests.forEach((t) => {
        it(`produces the correct output for ${t.operation}`, () => {
            t.tests.forEach(([val1, val2, useInt, expected]) => {
                const n = getNode(val1, val2, t.operation, useInt);
                expect(n.getInterface("Result").value).to.equal(expected);
            });
        });
    });

});
