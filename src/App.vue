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

import createEditor from "@/createEditor";
import { Calculator } from '@/calculator';

@Component
export default class extends Vue {

    editor = createEditor();

    async calculate() {
        const c = new Calculator(this.editor);
        console.log("Start");
        const results = await c.runBatch(10);
        console.log("Finish");
        console.log(results);
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
