import { expect } from "chai";
import { spy } from "sinon";
import { Editor } from "@baklavajs/core";
import { Engine } from "@baklavajs/plugin-engine";
import { runBatch } from "@/calculation";
import createEditor from "@/createEditor";

// tslint:disable-next-line: max-line-length
const testState = `{"nodes":[{"type":"OutputNode","id":"node_1555021720569","name":"OutputNode","options":[["Label","random"],["Value",null]],"state":{},"interfaces":[["Input",{"id":"ni_1555021720571"}]],"position":{"x":940,"y":135}},{"type":"UniformNode","id":"node_1555021735815","name":"UniformNode","options":[],"state":{},"interfaces":[["Output",{"id":"ni_1555021735816","value":null}],["Seed",{"id":"ni_1555021735817","value":"testseed"}],["Min",{"id":"ni_1555021735818","value":0}],["Max",{"id":"ni_1555021735819","value":10}],["Discrete",{"id":"ni_1555021735820","value":true}]],"position":{"x":287,"y":162}},{"type":"IndexValueNode","id":"node_1555021767737","name":"IndexValueNode","options":[],"state":{},"interfaces":[["Index",{"id":"ni_1555021767738","value":null}]],"position":{"x":283,"y":446}},{"type":"OutputNode","id":"node_1555021775609","name":"OutputNode","options":[["Label","idx"],["Value",null]],"state":{},"interfaces":[["Input",{"id":"ni_1555021775610"}]],"position":{"x":950,"y":559}},{"type":"MathNode","id":"node_1555021793616","name":"MathNode","options":[["Operation",{"selected":"Add","items":["Add","Subtract","Multiply","Divide","Sine","Cosine","Tangent","Arcsine","Arccosine","Arctangent","Power","Logarithm","Minimum","Maximum","Round","Modulo","Absolute"]}]],"state":{},"interfaces":[["Value 1",{"id":"ni_1555021793617","value":0}],["Value 2",{"id":"ni_1555021793618","value":0}],["Result",{"id":"ni_1555021793619","value":null}]],"position":{"x":669,"y":282}},{"type":"OutputNode","id":"node_1555021796384","name":"OutputNode","options":[["Label","sum"],["Value",null]],"state":{},"interfaces":[["Input",{"id":"ni_1555021796385"}]],"position":{"x":962,"y":353}}],"connections":[{"id":"1555021746857","from":"ni_1555021735816","to":"ni_1555021720571"},{"id":"1555021778889","from":"ni_1555021767738","to":"ni_1555021775610"},{"id":"1555021800000","from":"ni_1555021793619","to":"ni_1555021796385"},{"id":"1555021802350","from":"ni_1555021735816","to":"ni_1555021793617"},{"id":"1555021803671","from":"ni_1555021767738","to":"ni_1555021793618"}],"panning":{"x":3,"y":3},"scaling":1,"mlsettings":{"batchCount":100,"workerCount":4,"csvDelimiter":";"}}`;

const expectedResults = [
    [2, 0, 2], [8, 1, 9], [5, 2, 7], [4, 3, 7], [4, 4, 8], [9, 5, 14], [2, 6, 8],
    [1, 7, 8], [2, 8, 10], [3, 9, 12], [4, 10, 14], [5, 11, 16], [6, 12, 18], [0, 13, 13],
    [2, 14, 16], [8, 15, 23], [5, 16, 21], [4, 17, 21], [1, 18, 19], [8, 19, 27]
].map(([random, idx, sum]) => ({ random, idx, sum }));

function runBatchPromise(startIndex: number, endIndex: number, editor: Editor, engine: Engine) {
    return new Promise<Array<Record<string, any>>>(async (res) => {
        let results: Array<Record<string, any>> = [];
        await runBatch(startIndex, endIndex, editor, engine, (d) => {
            results = results.concat(d);
        });
        res(results);
    });
}

describe("Calculation", () => {

    it("correctly calculates a batch", async () => {
        const editor = createEditor();
        const engine = new Engine();
        editor.use(engine);
        editor.load(JSON.parse(testState));
        const res = await runBatchPromise(0, 19, editor, engine);
        expect(res).to.eql(expectedResults);
    });

    it("calls the progress callback regularly", async () => {
        const editor = createEditor();
        const engine = new Engine();
        editor.use(engine);
        editor.load(JSON.parse(testState));
        const cb = spy();
        await runBatch(0, 15000, editor, engine, cb);
        expect(cb.callCount).to.equal(2);
    });

});
