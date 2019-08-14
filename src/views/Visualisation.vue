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
import { Calculator, ResultsType } from "@/calculationManager";
import { SelectOption } from "@baklavajs/plugin-options-vue";
import App from "@/App.vue";

@Component({
    components: { ScatterPlot, SelectOption }
})
export default class Visualisation extends Vue {

    xSelect = { selected: "", items: [""] };
    ySelect = { selected: "", items: [""] };
    limit = 1000;
    points: Array<[number, number]> = [];

    getResults() {
        return (this.$parent as any).results || [];
    }

    @Watch("xSelect")
    @Watch("ySelect")
    updatePoints() {
        // both axis have to be selected
        if (!this.xSelect.selected || !this.ySelect.selected) {
            return [];
        }
        // get selected columns
        const x: string = this.xSelect.selected;
        const y: string = this.ySelect.selected;
        // filter
        let subList: ResultsType = [];
        if (this.getResults().length > this.limit) {
            const copy = this.getResults().slice();
            for (let i = 0; i < this.limit; i++) {
                const r = Math.floor(Math.random() * copy.length);
                subList.push(copy.splice(r, 1)[0]);
            }
        } else {
            subList = this.getResults();
        }
        this.points = subList
            .filter((r) => typeof(r[x]) === "number" && typeof(r[y]) === "number")
            .map((r) => [ r[x], r[y] ] as [number, number]);
        // show only a subpart of numbers to prevent excessing load times
        // only axis type "number" is supported
    }

    mounted() {
        if (this.getResults().length === 0) {
            return;
        }
        const columns = Object.keys(this.getResults()[0])
            .filter((k) => typeof(this.getResults()[0][k]) === "number");
        this.xSelect.items = columns;
        this.ySelect.items = columns;
    }

}
</script>
