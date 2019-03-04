import { Editor, Node } from "baklavajs";

export class Calculator {

    editor: Editor;

    public constructor(editor: Editor) {
        this.editor = editor;
    }

    public async runBatch(batchSize: number) {
        const e = this.editor;

        // prepare every node
        e.nodes.forEach((n: any) => {
            if (n.prepare) {
                n.prepare();
            }
        });

        const indexValueNodes = e.nodes.filter((n) => n.type === "IndexValue");
        const outputNodes = e.nodes
            .filter((n) => n.type === "OutputNode")
            .map((n) => [ n.getOptionValue("Label"), n ]) as Array<[string, Node]>;

        const results = [];

        for (let i = 0; i < batchSize; i++) {

            // inject current index into every IndexValueNode
            indexValueNodes.forEach((n) => n.getInterface("Index").value = i);

            // calculate all nodes
            await e.calculate();

            const result = outputNodes
                .reduce((p, c) => {
                    p[c[0]] = (c[1].state as Record<string, any>).result;
                    return p;
                }, {} as Record<string, any>);
            results.push(result);

        }

        return results;

    }

}
