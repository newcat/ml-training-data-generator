<template>
    <div style="width:100%;height:90vh;">
        <baklava-editor :model="editor"></baklava-editor>
        <button @click="calculate">Calculate</button>
        <button @click="save">Save</button>
        <button @click="load">Load</button>
        <button @click="test">Test</button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Editor } from "baklavajs";

import { remote } from "electron";
const dialog = remote.dialog;
const app = remote.app;
import fs from "fs";


import random from "random";
import seedrandom from "seedrandom";

import UniformNode from "./UniformNode";
import NormalNode from "./NormalNode";
import ExponentialNode from "./ExponentialNode";
import OutputNode from "./OutputNode";

@Component
export default class extends Vue {

    editor = new Editor();

    mounted() {
        this.editor.registerNodeType("UniformNode", UniformNode, "Random");
        this.editor.registerNodeType("NormalNode", NormalNode, "Random");
        this.editor.registerNodeType("ExponentialNode", ExponentialNode, "Random");
        this.editor.registerNodeType("OutputNode", OutputNode, "Output");
    }
  
    calculate() {
        this.editor.calculate();
    }

    save() {
        const projectData = JSON.stringify(this.editor.save());
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
        });
    }

    load() {
        dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
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
        });
    }

    test() {
        const rng = random.clone();
        rng.use(seedrandom("test"));

        const ug = rng.uniform(0, 10);
        
        let a = [];
        for (let i = 0; i < 10; i++) {
            a.push(Math.round(ug()));
        }
        console.log(a);
    }

}
</script>
