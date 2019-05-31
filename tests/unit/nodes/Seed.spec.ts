import { expect } from "chai";
import ExponentialNode from "@/nodes/random/ExponentialNode";
import NormalNode from "@/nodes/random/NormalNode";
import PercentageNode from "@/nodes/random/PercentageNode";
import UniformNode from "@/nodes/random/UniformNode";
import CustomNode from "@/nodes/random/custom/CustomNode";

const seed = "MySeed";
const indices = [0, 5, 10, 35, 305];
const nodes = [ExponentialNode, NormalNode, PercentageNode, UniformNode, CustomNode];

describe("Random Seeds", () => {

    nodes.forEach((n) => {
        const ni = new n();
        it(`${ni.type} calculates the same values for the same seed`, () => {
            const n1 = new n();
            n1.getInterface("Seed").value = seed;
            n1.prepare();
            const values1 = indices.map((i) => {
                n1.state.index = i;
                n1.calculate();
                return n1.getInterface("Output").value;
            });
            const n2 = new n();
            n2.getInterface("Seed").value = seed;
            n2.prepare();
            const values2 = indices.map((i) => {
                n2.state.index = i;
                n2.calculate();
                return n2.getInterface("Output").value;
            });
            expect(values1).to.eql(values2);
        });
    });

});
