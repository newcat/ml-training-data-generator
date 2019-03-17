<template>
<div>
    <h3>Custom Distribution</h3>
    <p> Seed: {{ seed }} </p>
    <p> Discrete: {{ discrete }} </p>
    <custom-editor>
    </custom-editor>
    <button @click="test" class="dark-button mt-3 w-100">Test</button>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CustomNode from "./CustomNode";
import CustomEditor from "./CustomEditor.vue";

@Component({
    components: {  CustomEditor }
})
export default class CustomOption extends Vue {

    @Prop()
    node!: CustomNode;

    @Prop()
    value!: any;

    get seed() {
        return this.node.getInterface("Seed").value;
    }

    get discrete() {
        return this.node.getInterface("Discrete").value;
    }

    test() {
        console.log("NAME:"+this.node.name);
    }

}
</script>
