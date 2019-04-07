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
import { Calculator } from "../calculator";
import { SelectOption } from "@baklavajs/plugin-options-vue";

@Component({
    components: { ScatterPlot, SelectOption }
})
export default class Visualisation extends Vue {

    @Prop()
    calculator!: Calculator;

    xSelect = { selected: "", items: [""] };
    ySelect = { selected: "", items: [""] };

    get points() {
        if (!this.xSelect.selected || !this.ySelect.selected) {
            return [];
        }
        const x: string = this.xSelect.selected;
        const y: string = this.ySelect.selected;
        const p = this.calculator.results.map((r) => [ r[x], r[y] ] as [number, number]);
        // Remove duplicates for better performance of the scatter plot
        return this.removeDuplicates(p);
    }

    mounted() {
        if (this.calculator.results.length === 0) {
            return;
        }

        const columns = Object.keys(this.calculator.results[0])
            .filter((k) => this.calculator.results.every((r) => typeof(r[k]) === "number"));
        this.xSelect.items = columns;
        this.ySelect.items = columns;
    }

    // Remove Duplicates from an array of points
    removeDuplicates(a: Array<[number, number]>) {
        const hash: any = {};
        const out: any = [];
        for (let i = 0, l = a.length; i < l; i++) {
            let key = a[i].join('|');
            if (!hash[key]) {
                out.push(a[i]);
                hash[key] = true;
            }
        }
        return out;
    }
}
</script>
