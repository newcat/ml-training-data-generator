<template>
<div>
    <h3>Inputs</h3>
    <interface-view
        v-for="(intf, iname) in node.inputInterfaces" :key="iname" :name="iname" class="mt-3"
        @remove="remove(iname)" @rename="renameInput(iname, $event)"
    >
    </interface-view>
    <button @click="addInput" class="dark-button mt-3 w-100">Add Input</button>

    <h3 class="mt-3">Function</h3>
    <code-editor :value="value" @input="$emit('input', $event)"></code-editor>

    <h3 class="mt-3">Outputs</h3>
    <interface-view
        v-for="(intf, iname) in node.outputInterfaces" :key="iname" :name="iname" class="mt-3"
        @remove="remove(iname)" @rename="renameOutput(iname, $event)"
    >
    </interface-view>
    <button @click="addOutput" class="dark-button mt-3 w-100">Add Output</button>

</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FunctionNode from "../nodes/FunctionNode";
import InterfaceView from "./InterfaceView.vue";
import CodeEditor from "./CodeEditor.vue";

@Component({
    components: { InterfaceView, CodeEditor }
})
export default class CodeOption extends Vue {

    // TODO: Make interface list reactive

    @Prop()
    node!: FunctionNode;

    @Prop()
    value!: string;

    addInput() {
        this.node.addInput("Input" + Object.keys(this.node.inputInterfaces).length);
    }

    addOutput() {
        this.node.addOutput("Output" + Object.keys(this.node.outputInterfaces).length);
    }

    remove(name: string) {
        this.node.removeInterface(name);
    }

    renameInput(from: string, to: string) {
        this.node.removeInterface(from);
        this.node.addInput(to);
    }

    renameOutput(from: string, to: string) {
        this.node.removeInterface(from);
        this.node.addOutput(to);
    }

}
</script>
