<template>
    <div style="width:100%;height:90vh;">
        <baklava-editor :model="editor"></baklava-editor>
        <button @click="calculate">Calculate</button>
        <button @click="save">Save</button>
        <button @click="load">Load</button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Editor, NodeConstructor } from "baklavajs";

// @ts-ignore
import random from "random";
import seedrandom from "seedrandom";

import UniformNode from "./nodes/random/UniformNode";
import NormalNode from "./nodes/random/NormalNode";
import ExponentialNode from "./nodes/random/ExponentialNode";
import OutputNode from "./nodes/OutputNode";
import { BooleanValueNode, NumberValueNode, StringValueNode } from "./nodes/ValueNodes";
import * as ValueNodes from "./nodes/ValueNodes";

@Component
export default class extends Vue {

    editor = new Editor();

    mounted() {
        Object.keys(ValueNodes).forEach((x) => {
            this.editor.registerNodeType(x, (ValueNodes as Record<string, NodeConstructor>)[x], "Value");
        });
        this.editor.registerNodeType("UniformNode", UniformNode, "Random");
        this.editor.registerNodeType("NormalNode", NormalNode, "Random");
        this.editor.registerNodeType("ExponentialNode", ExponentialNode, "Random");
        this.editor.registerNodeType("OutputNode", OutputNode);
        this.editor.nodeInterfaceTypes
            .addType("number", "cyan")
            .addType("string", "white")
            .addType("boolean", "lightgreen")
            .addConversion("number", "string", String)
            .addConversion("number", "boolean", (v) => !!v)
            .addConversion("string", "number", parseFloat)
            .addConversion("boolean", "number", (v) => v ? 1 : 0)
            .addConversion("boolean", "string", String);
    }

    calculate() {
        this.editor.nodes.forEach((n: any) => {
            if (n.prepare) {
                n.prepare();
            }
        });
        this.editor.calculate();
    }

    save() {
        // TODO
        /*const projectData = JSON.stringify(this.editor.save());
        const options = {
            defaultPath: app.getPath('documents') + '/ml-training-data-project.json'
        };
        dialog.showSaveDialog(options, (filePath) => {
            if (filePath === undefined) {
                console.log("No file path been chosen!");
                return;
            }

            fs.writeFile(filePath, projectData, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    alert("Your project has been successfully saved!");
                }
            });
        });*/
    }

    load() {
        // TODO
        /*dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
            if(filePaths === undefined || filePaths.length !== 1) {
                console.log("No file path has been chosen! Please select exactly one file to open.");
                return;
            }

            fs.readFile(filePaths[0], (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(JSON.parse(data.toString()));
                    this.editor.load(JSON.parse(data.toString()));
                }
            });
        });*/
    }

}
</script>
