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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CustomNode from "./CustomNode";
import { SelectOption } from "@baklavajs/plugin-options-vue";
import CustomRandom from "./CustomRandom.vue";
import { NodeInterface } from '@baklavajs/core';

type Vector2D = [number, number];

@Component({
    components: { SelectOption, CustomRandom }
})
export default class CustomOption extends Vue {

    @Prop()
    node!: CustomNode;

    @Prop()
    value!: any;

    width: number = 800;

    selectValue: { selected: string, items: string[] } = {
        selected: this.value.mode,
        items: ["curveMonotone", "curveLinear", "curveStepBefore", "curveStepMid", "curveStepAfter"]
    };

    seedInterface: NodeInterface = this.node.getInterface("Seed");
    minInterface: NodeInterface = this.node.getInterface("Min");
    maxInterface: NodeInterface = this.node.getInterface("Max");
    discreteInterface: NodeInterface = this.node.getInterface("Discrete");

    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D|null;

    @Watch("selectValue")
    onSelectValueChange() {
        this.value.mode = this.selectValue.selected;
    }

    get mode() {
        return this.selectValue.selected;
    }

    get seed() {
        return this.seedInterface.value;
    }

    get discrete() {
        return this.discreteInterface.value;
    }

    get min() {
        return this.minInterface.value;
    }

    get max() {
        return this.maxInterface.value;
    }

    // Save points from component via event
    updatePoints(points: Vector2D[]) {
        this.value.points = points;
    }

    // Calculate random number via event
    calculate() {
        this.$emit("calculate");
    }

}
</script>
