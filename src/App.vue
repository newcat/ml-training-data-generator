<template lang="pug">
div.d-flex.flex-column(style="width:100%;height:100%;")
    navbar.flex-shrink(@action="onAction", :loadedRows="loadedRows")
    
    settings.flex-fill(v-if="$route.name === 'settings'", v-model="settings")
    visualisation.flex-fill(v-else-if="$route.name === 'visualisation'")
    preview.flex-fill(v-else-if="$route.name === 'preview'", @error="onError")
    baklava-editor.flex-fill(v-else, :plugin="plugin")

    notification(header="Error", v-model="showErrorNotification") {{ errorMessage }}

    progress-modal(:open="calculating", :progress="progress", @cancel="cancelCalculation")
    
    input(ref="fileinput", type="file", accept="application/json", style="display: none;", @change="loadFile")
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import { OptionPlugin } from "@baklavajs/plugin-options-vue";

import createEditor from "@/createEditor";
import { Calculator, IProgressEventData, ResultsType } from '@/calculationManager';
import { IPlugin } from '@baklavajs/core/dist/types';
import { ViewPlugin } from '@baklavajs/plugin-renderer-vue';
import { Engine } from "@baklavajs/plugin-engine";

import FunctionSidebarOption from "@/options/CodeOption.vue";
import StringListOption from "@/options/StringListOption";
import CustomButtonOption from "@/options/CustomButtonOption.vue";
import CustomRandomOption from "@/nodes/random/custom/CustomOption.vue";
import DiscreteRandomOption from "@/nodes/random/discrete/DiscreteOption.vue";

import Navbar from "@/components/Navbar.vue";
import ProgressModal from "@/components/ProgressModal.vue";
import Notification from "@/components/Notification.vue";
import Settings from "@/views/Settings.vue";
import Preview from "@/views/Preview.vue";

@Component({
    components: {
        Navbar,
        Settings,
        Visualisation: () => import("@/views/Visualisation.vue"),
        Preview,
        ProgressModal,
        Notification
    }
})
export default class extends Vue {

    editor = createEditor();
    calculator = new Calculator(this.editor);
    plugin = new ViewPlugin();

    calculating = false;
    progress = 0;
    loadedRows = 0;

    // Not initializing here, as we don't want change detection on this
    results?: ResultsType;

    settings = {
        batchCount: 100,
        workerCount: 4,
        csvDelimiter: ";"
    };

    errorMessage = "";
    showErrorNotification = false;

    @Provide("app")
    app = this;

    constructor() {
        super();

        this.editor.use(this.plugin);
        this.editor.use(new OptionPlugin());
        this.editor.use(new Engine(false));

        this.plugin.registerOption("FunctionSidebarOption", FunctionSidebarOption);
        this.plugin.registerOption("StringListOption", StringListOption);
        this.plugin.registerOption("CustomRandomOption", CustomRandomOption);
        this.plugin.registerOption("DiscreteRandomOption", DiscreteRandomOption);
        this.plugin.registerOption("CustomButtonOption", CustomButtonOption);

        this.calculator.events.progress.addListener(this, (p) => this.onCalculationProgress(p));

        window.onbeforeunload = () => {
            return "Please ensure you have saved everything.\nDo you want to leave the page?";
        };

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
        this.plugin.hooks.renderNode.tap(this, (v) => {
            if (v.data.type === "OutputNode") {
                (v.$el as HTMLElement).style.backgroundColor = "#5379B5CC";
            }
            return v;
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

    async calculate() {
        this.calculating = true;
        this.progress = 0;
        try {
            this.results = await this.calculator.run(this.settings.batchCount);
            this.loadedRows = this.results.length;
        } catch (err) {
            this.onError(err);
        }
        this.calculating = false;
    }

    onCalculationProgress(p: IProgressEventData) {
        this.progress = p.current * 100 / p.total;
    }

    cancelCalculation() {
        this.calculator.cancel();
    }

    onError(msg: string) {
        this.errorMessage = msg;
        this.showErrorNotification = true;
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
        (this.$refs.fileinput as HTMLInputElement).type = "text";
        (this.$refs.fileinput as HTMLInputElement).type = "file";
    }

    export() {
        if (!this.results || this.results.length === 0) {
            this.errorMessage = "No rows loaded. Please calculate first";
            this.showErrorNotification = true;
            return;
        }

        let csv = Object.keys(this.results[0]).join(this.settings.csvDelimiter) + "\n";
        this.results.forEach((r) => {
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
