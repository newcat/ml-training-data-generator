<template>
<div>
    <h3>Custom Distribution</h3>
    <select-option
        v-model="selectValue"
    ></select-option>
    <custom-random
        ref="customRandom"
        :loadedPoints="value.points"
        :min="min"
        :max="max"
        :mode="selectValue.selected"
        @pointsUpdated="updatePoints"
    ></custom-random>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CustomNode from "./CustomNode";
import { SelectOption } from "@baklavajs/plugin-options-vue";
import CustomRandom from "./CustomRandom.vue";

type Vector2D = [number, number];

@Component({
    components: { SelectOption, CustomRandom }
})
export default class CustomOption extends Vue {
    @Prop()
    node!: CustomNode;

    @Prop()
    value!: any;

    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D|null;

    width: number = 800;
    selectValue: { selected: string, items: string[] } = {
        selected: this.value.mode,
        items: ["curveMonotone", "curveLinear", "curveStepBefore", "curveStepMid", "curveStepAfter"]
    };

    get mode() {
        return this.selectValue.selected;
    }

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
