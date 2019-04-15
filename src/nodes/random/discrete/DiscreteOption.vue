<template>
<div>
    <h3>Discrete Distribution</h3>
    <discrete-random
        :loadedValues="value.values"
        :min="min"
        :max="max"
        @valuesUpdated="updateValues"
    ></discrete-random>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { NodeInterface } from '@baklavajs/core';
import DiscreteNode from "./DiscreteNode";
import DiscreteRandom from "./DiscreteRandom.vue";

@Component({
    components: { DiscreteRandom }
})
export default class DiscreteOption extends Vue {

    @Prop()
    node!: DiscreteNode;

    @Prop()
    value!: any;

    minInterface: NodeInterface = this.node.getInterface("Min");
    maxInterface: NodeInterface = this.node.getInterface("Max");

    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D|null;

    get min() {
        return this.minInterface.value;
    }

    get max() {
        return this.maxInterface.value;
    }

    // Save points from component vie event
    updateValues(values: number[]) {
        this.value.values = values;
    }
}
</script>
