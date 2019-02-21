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

import random from "random";
//import { Storage } from "electron-json-storage";


import UniformNode from "./UniformNode";
import NormalNode from "./NormalNode";
import ExponentialNode from "./ExponentialNode";
import OutputNode from "./OutputNode";

@Component
export default class  extends Vue {

    editor = new Editor();

    mounted() {
        this.editor.registerNodeType("UniformNode", UniformNode, "Random");
        this.editor.registerNodeType("NormalNode", NormalNode, "Random");
        this.editor.registerNodeType("ExponentialNode", ExponentialNode, "Random");
        this.editor.registerNodeType("OuputNode", OutputNode, "Output");
    }
  
    calculate() {
        //this.editor.calculate();
        const x = random.exponential(125.54);
        console.log(x());
    }

    save() {
        console.log(JSON.stringify(this.editor.save()));
    }

    load() {

    }

}
</script>
