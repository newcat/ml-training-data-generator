<template lang="pug">
div.bg-dark.text-light
    .container.mt-3
        div.form-group
            label Data Visualisation via 2-dimensional Scatter Plot
        scatter-plot(:data="points")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import ScatterPlot from "@/components/ScatterPlot.vue";

@Component({
    components: { ScatterPlot }
})
export default class Visualisation extends Vue {

    @Prop()
    value!: any;

    points: Array<[number, number]> = [
        [10, 10],
        [20, 20],
        [30, 30],
        [40, 40],
        [50, 50],
        [60, 60],
        [70, 70]
    ];

}
</script>
