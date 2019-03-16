<template>
    <div style="width:100%;height:90vh;">
        <baklava-editor :model="editor"></baklava-editor>
        <button @click="calculate">Calculate</button>
        <button @click="save">Save</button>
        <button @click="load">Load</button>
        <input ref="fileinput" type="file" accept="application/json" style="display: none;" @change="loadFile">
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import createEditor from "@/createEditor";
import { Calculator } from '@/calculator';
import CustomNode from '@/nodes/random/CustomNode';

@Component
export default class extends Vue {

    editor = createEditor();
    c = new Calculator(this.editor);

    mounted() {
        this.c.setWorkerCount(4);
        this.editor.addNode("CustomNode");
    }

    async calculate() {
        console.log("Start");
        const results = await this.c.runBatch(10);
        console.log("Finish");
        console.log(results);
    }

    save() {
        const s = JSON.stringify(this.editor.save());
        const blob = new Blob([s], { type: "application/json" });
        const a = document.createElement("a");
        a.download = "project.json";
        a.href = window.URL.createObjectURL(blob);
        a.click();
    }

    load() {
        const inp = this.$refs.fileinput as HTMLInputElement;
        inp.click();
    }

    loadFile(event: any) {
        const file = event.target.files[0] as File;
        const reader = new FileReader();
        reader.onload = async (readerEvent) => {
            this.editor.load(JSON.parse((readerEvent.target as any).result));
        };
        reader.readAsText(file);
    }

}
</script>

<style>
.ace_tooltip {
    left: 10px !important;
}
</style>

