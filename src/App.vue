<template lang="pug">
div.d-flex.flex-column(style="width:100%;height:100%;")
    navbar.flex-shrink(@action="onAction", :loadedRows="loadedRows")
    
    settings.flex-fill(v-if="$route.name === 'settings'", v-model="settings")
    visualisation.flex-fill(v-else-if="$route.name === 'visualisation'", :calculator="calculator")
    preview.flex-fill(v-else-if="$route.name === 'preview'")
    baklava-editor.flex-fill(v-else, :plugin="plugin")

    progress-modal(:open="calculating", :progress="progress")
    
    input(ref="fileinput", type="file", accept="application/json", style="display: none;", @change="loadFile")
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";

import createEditor from "@/createEditor";
import { Calculator, IProgressEventData } from '@/calculator';
import { IPlugin } from '@baklavajs/core';
import { ViewPlugin } from '@baklavajs/plugin-renderer-vue';

import FunctionSidebarOption from "@/options/CodeOption.vue";
import StringListOption from "@/options/StringListOption";
import CustomRandomOption from "@/nodes/random/custom/CustomOption.vue";

import Navbar from "@/components/Navbar.vue";
import ProgressModal from "@/components/ProgressModal.vue";
import Settings from "@/views/Settings.vue";
import Visualisation from "@/views/Visualisation.vue";
import Preview from "@/views/Preview.vue";

@Component({
    components: { Navbar, Settings, Visualisation, Preview, ProgressModal }
})
export default class extends Vue {

    editor = createEditor();
    calculator = new Calculator(this.editor);
    plugin = new ViewPlugin();

    calculating = false;
    progress = 0;
    loadedRows = 0;
    time = 0;

    settings = {
        batchCount: 100,
        workerCount: 4,
        csvDelimiter: ";"
    };

    visualisation = [
        [10, 10],
        [20, 20],
        [30, 30],
        [40, 40],
        [50, 50],
        [60, 60],
        [70, 70]
    ];

    @Provide("app")
    app = this;

    constructor() {
        super();

        this.editor.use(this.plugin);
        this.editor.use(new OptionPlugin());

        this.plugin.registerOption("FunctionSidebarOption", FunctionSidebarOption);
        this.plugin.registerOption("StringListOption", StringListOption);
        this.plugin.registerOption("CustomRandomOption", CustomRandomOption);

        this.calculator.events.progress.addListener(this, (p) => this.onCalculationProgress(p));
        this.calculator.events.finished.addListener(this, () => this.onCalculationFinished());

    }

    mounted() {
        this.calculator.setWorkerCount(this.settings.workerCount);
        this.editor.hooks.save.tap(this, (state) => {
            state.mlsettings = this.settings;
            return state;
        });
        this.editor.hooks.load.tap(this, (state) => {
            if (state.mlsettings) {
                this.settings = state.mlsettings;
            }
            return state;
        });
    }

    onAction(action: string) {
        switch (action) {
            case "load":
                this.load();
                break;
            case "save":
                this.save();
                break;
            case "calculate":
                this.calculate();
                break;
            case "export":
                this.export();
                break;
        }
    }

    calculate() {
        this.time = Date.now();
        this.calculating = true;
        this.progress = 0;
        this.calculator.run(this.settings.batchCount);
    }

    onCalculationProgress(p: IProgressEventData) {
        this.progress = p.current * 100 / p.total;
    }

    onCalculationFinished() {
        this.calculating = false;
        this.loadedRows = this.calculator.results.length;
        console.log("Duration:" + (Date.now() - this.time));
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
            this.calculator.reset();
        };
        reader.readAsText(file);
        (this.$refs.fileinput as HTMLInputElement).type = "text";
        (this.$refs.fileinput as HTMLInputElement).type = "file";
    }

    export() {
        if (this.calculator.results.length === 0) {
            return;
        }

        let csv = Object.keys(this.calculator.results[0]).join(this.settings.csvDelimiter) + "\n";
        this.calculator.results.forEach((r) => {
            csv += Object.values(r).join(this.settings.csvDelimiter) + "\n";
        });
        csv = csv.slice(0, -1); // remove trailing newline

        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a");
        a.download = "data.csv";
        a.href = window.URL.createObjectURL(blob);
        a.click();
    }

    onSettingsUpdate(newSettings: any) {
        this.settings = newSettings;
        this.calculator.setWorkerCount(newSettings.workerCount);
    }

}
</script>
