import { expect } from "chai";
import CustomNode from "@/nodes/random/discrete/DiscreteNode";

describe("DiscreteNode", () => {

    it(`calculates random numbers in correct range`, () => {
        // Define node configuration
        const min = 39;
        const max = 142;
        const values = [20, 33, 55, 10, 90, 33, 0, 50];

        // Pass configuration to node
        const n = new CustomNode();
        n.getInterface("Min").value = min;
        n.getInterface("Max").value = max;
        const v = n.getOptionValue("Discrete Distribution");
        v.values = values;
        n.setOptionValue("Discrete Distribution", v);

        // Calculate 10000 random values
        n.prepare();
        let inRange = true;
        for (let i = 0; i < 1000; i++) {
            n.calculate();
            const r = parseFloat(n.getInterface("Output").value);
            if (r < min || r > max) {
                inRange = false;
            }
        }
        expect(inRange).to.be.true;
    });

    it(`calculates peak correctly`, () => {
        // Define node configuration
        const min = 99;
        const max = 105;
        const extremum = 4;
        const values = [20, 33, 55, 10, 90, 33, 50];

        // Pass configuration to node
        const n = new CustomNode();
        n.getInterface("Min").value = min;
        n.getInterface("Max").value = max;
        const v = n.getOptionValue("Discrete Distribution");
        v.values = values;
        n.setOptionValue("Discrete Distribution", v);

        // Setup data to store occurrences
        const data: number[] = [];
        for (const i of values) {
            data.push(0);
        }

        // Calculate 10000 random values
        n.prepare();
        for (let i = 0; i < 10000; i++) {
            n.calculate();
            const r = parseInt(n.getInterface("Output").value, 10) - min;
            data[r]++;
        }
        expect(Math.max(...data) === data[extremum]).to.be.true;
    });
});
