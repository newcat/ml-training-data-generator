<template>
<div>
    <h3>Custom Distribution</h3>
    <select v-model="value.mode">
        <option>curveMonotone</option>
        <option>curveLinear</option>
        <option>curveStep</option>
    </select>
    <custom-random
        ref = "customRandom"
        :loadedPoints = value.points
        :min = min
        :max = max
        :mode = value.mode
        @pointsUpdated = "updatePoints"
    ></custom-random>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CustomNode from "./CustomNode";
import { Vector2D } from "./curve";

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

    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D|null;

    get seed() {
        return this.node.getInterface("Seed").value;
    }

    get discrete() {
        return this.node.getInterface("Discrete").value;
    }

    get min() {
        return this.node.getInterface("Min").value;
    }

    get max() {
        return this.node.getInterface("Max").value;
    }

    generateRandom() {
        this.value = Math.random();
    }

    // Save points from component vie event
    updatePoints(points: Vector2D[]) {
        this.value.points = points;
    }

    // Calculate random number via event
    calculate() {
        this.$emit("calculate");
    }

}
</script>
