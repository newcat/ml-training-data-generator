<template>
<div>
    <h3>Custom Distribution</h3>
    <p> Value: {{ value.points }} </p>
    <p> Seed: {{ seed }} </p>
    <p> Discrete: {{ discrete }} </p>
        <custom-random
            ref = "customRandom"
            :loadedPoints = value.points
            @pointsUpdated = "updatePoints"
        ></custom-random>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CustomNode from "./CustomNode";

// The following is necessary to prevent ace from being loaded in a web worker
const components = {};
// @ts-ignore
if (typeof(WorkerGlobalScope) === 'undefined' || !(self instanceof WorkerGlobalScope)) {
    // @ts-ignore
    components.CustomRandom = () => import("./CustomRandom.vue").then((module) => module.default);
}

@Component({
    components
})
export default class CustomOption extends Vue {

    @Prop()
    node!: CustomNode;

    @Prop()
    value!: any;

    width: number = 800;
    mode: string = "linearCurve";

    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D|null;

    get seed() {
        return this.node.getInterface("Seed").value;
    }

    get discrete() {
        return this.node.getInterface("Discrete").value;
    }

    generateRandom() {
        this.value = Math.random();
    }

    // Save points from component vie event
    updatePoints(points: Array<[number, number]>) {
        this.value.points = points;
    }

    // Calculate random number via event
    calculate() {
        this.$emit("calculate");
    }

}
</script>
