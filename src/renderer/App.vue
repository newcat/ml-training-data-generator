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
import { Editor } from "baklavajs";
//import { Storage } from "electron-json-storage";
import random from "random";
import RandomNode from "./RandomNode";

@Component
export default class  extends Vue {

    editor = new Editor();

    mounted() {
        this.editor.registerNodeType("RandomNode", RandomNode, "Math");

        this.editor.addNode(new RandomNode());
    }
  
    calculate() {
        this.editor.calculate();
        console.log("Random: " + random.float());
    }

    save() {
        console.log(JSON.stringify(this.editor.save()));
    }

    load() {

    }

}
</script>
