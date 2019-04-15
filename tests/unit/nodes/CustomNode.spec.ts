import { expect } from "chai";
import CustomNode from "@/nodes/random/custom/CustomNode";

const modes = ["curveLinear", "curveMonotone"];

describe("CustomNode", () => {

    modes.forEach((mode) => {
        it(`calculates random numbers in correct range (mode: '${mode}')`, () => {
            // Define node configuration
            const min = 39;
            const max = 142;
            const points = [[0, 10], [12, 47], [25, 12], [60, 88], [100, 30]];

            // Pass configuration to node
            const n = new CustomNode();
            n.getInterface("Min").value = min;
            n.getInterface("Max").value = max;
            const v = n.getOptionValue("Custom Distribution");
            v.mode = mode;
            v.points = points;
            n.setOptionValue("Custom Distribution", v);

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
            expect(inRange);
        });

        it(`calculates peak correctly (mode: '${mode}')`, () => {
            // Define node configuration
            const min = 5;
            const max = 105;
            const extremum = 50;
            const points = [[0, 0], [extremum, 100], [100, 0]];

            // Pass configuration to node
            const n = new CustomNode();
            n.getInterface("Min").value = min;
            n.getInterface("Max").value = max;
            const v = n.getOptionValue("Custom Distribution");
            v.mode = mode;
            v.points = points;
            n.setOptionValue("Custom Distribution", v);

            // Setup data to store occurrences
            const data: number[] = [];
            for (let i = 0; i < 10; i++) {
                data.push(0);
            }

            // Calculate 10000 random values
            n.prepare();
            for (let i = 0; i < 10000; i++) {
                n.calculate();
                const r = Math.floor((parseFloat(n.getInterface("Output").value) - min) / (max - min + 1) * 10);
                data[r]++;
            }
            const e = Math.floor((extremum - min) / (max - min + 1) * 10);
            expect(Math.max(...data) === data[e]);
        });
    });
});
