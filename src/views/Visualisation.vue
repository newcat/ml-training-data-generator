<template lang="pug">
div.bg-dark.text-light
    .container.mt-3
        
        div.d-flex
            div.mr-3.flex-grow-1.text-nowrap X-Axis
            select-option(v-model="xSelect", name="X-Axis")

        div.d-flex.mt-2
            div.mr-3.flex-grow-1.text-nowrap Y-Axis
            select-option(v-model="ySelect", name="Y-Axis")

        scatter-plot.mt-4(:data="points")

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import ScatterPlot from "@/components/ScatterPlot.vue";
import { Calculator } from "@/calculationManager";
import { SelectOption } from "@baklavajs/plugin-options-vue";
import App from "@/App.vue";

@Component({
    components: { ScatterPlot, SelectOption }
})
export default class Visualisation extends Vue {

    @Inject("app")
    app!: App;

    xSelect = { selected: "", items: [""] };
    ySelect = { selected: "", items: [""] };

    get points() {
        if (!this.xSelect.selected || !this.ySelect.selected) {
            return [];
        }
        const x: string = this.xSelect.selected;
        const y: string = this.ySelect.selected;
        const p = this.app.results.map((r) => [ r[x], r[y] ] as [number, number]);
        return p;
    }

    mounted() {
        if (this.app.results.length === 0) {
            return;
        }
        const columns = Object.keys(this.app.results[0])
            .filter((k) => this.app.results.every((r) => typeof(r[k]) === "number"));
        this.xSelect.items = columns;
        this.ySelect.items = columns;
    }
}
</script>
