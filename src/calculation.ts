import { Editor, Node } from "@baklavajs/core";
import { Engine } from "@baklavajs/plugin-engine";

interface IPreparableNode extends Node {
    prepare?(): void;
}

const MAX_TRIES = 1000;

export async function runBatch(startIndex: number, endIndex: number, editor: Editor, engine: Engine,
                               resultCallback: (data: Array<Record<string, any>>) => void) {

    // prepare every node
    editor.nodes.forEach((n: IPreparableNode) => {
        if (n.prepare) {
            n.prepare();
        }
    });

    const outputNodes = editor.nodes
        .filter((n) => n.type === "OutputNode")
        .map((n) => [ n.getOptionValue("Label"), n ]) as Array<[string, Node]>;

    const constraintNodes = editor.nodes.filter((n) => n.type === "ConstraintNode");

    let results = [];
    let tries = 0;
    for (let i = startIndex; i <= endIndex; i++) {

        // inject current index into every IndexValueNode
        editor.nodes.forEach((n) => { n.state.index = i; });

        // calculate all nodes
        await engine.calculate();

        if (constraintNodes.some((n) => n.getInterface("Is Valid").value === false)) {
            tries++;
            i--;
            if (tries >= MAX_TRIES) {
                throw new Error("Constraint node caused infinite loop");
            }
            continue;
        }

        tries = 0;
        const result: Record<string, any> = {};
        outputNodes.forEach(([label, node]) => {
            result[label] = node.state.result;
        });
        results.push(result);

        if (results.length >= 10000) {
            resultCallback(results);
            results = [];
        }

    }

    if (results.length > 0) {
        resultCallback(results);
    }

}
