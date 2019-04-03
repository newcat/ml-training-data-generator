<template lang="pug">
div.d-flex.flex-column(style="width:100%;height:100%;")
    navbar.flex-shrink(@save="save", @load="load", @calculate="calculate")
    
    settings.flex-fill(v-if="$route.name === 'settings'", v-model="settings")
    baklava-editor.flex-fill(v-else, :plugin="plugin")
    
    input(ref="fileinput", type="file", accept="application/json", style="display: none;", @change="loadFile")
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";

import createEditor from "@/createEditor";
import { Calculator } from '@/calculator';
import { IPlugin } from '@baklavajs/core';
import { ViewPlugin } from '@baklavajs/plugin-renderer-vue';

import FunctionSidebarOption from "@/options/CodeOption.vue";
import StringListOption from "@/options/StringListOption";
import CustomRandomOption from "@/nodes/random/custom/CustomOption.vue";

import Navbar from "@/components/Navbar.vue";
import Settings from "@/views/Settings.vue";

@Component({
    components: { Navbar, Settings }
})
export default class extends Vue {

    editor = createEditor();
    c = new Calculator(this.editor);
    plugin = new ViewPlugin();

    settings = {
        batchCount: 100
    };

    @Provide("app")
    app = this;

    constructor() {
        super();
        this.editor.use(this.plugin);
        this.editor.use(new OptionPlugin());

        this.plugin.registerOption("FunctionSidebarOption", FunctionSidebarOption);
        this.plugin.registerOption("StringListOption", StringListOption);
        this.plugin.registerOption("CustomRandomOption", CustomRandomOption);

    }

    mounted() {
        this.c.setWorkerCount(4);
    }

    async calculate() {
        console.log("Start");
        const results = await this.c.runBatch(this.settings.batchCount);
        console.log("Finish");
        if (results) {
            const blob = new Blob([results.data], { type: "text/csv" });
            const a = document.createElement("a");
            a.download = "data.csv";
            a.href = window.URL.createObjectURL(blob);
            a.click();
        }
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

