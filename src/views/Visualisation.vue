<template lang="pug">
div.bg-dark.text-light
    .container.mt-3
        div.form-group
            label Data Visualisation via 2-dimensional Scatter Plot
        scatter-plot(:data="value.data")
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

}
</script>
