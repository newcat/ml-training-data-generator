<template>
    <ace-editor
        :value="value" @input="$emit('input', $event)"
        @init="editorInit" lang="javascript" theme="chrome" height="300px"
    ></ace-editor>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

// The following is necessary to prevent ace from being loaded in a web worker
const components = {};
// @ts-ignore
if (typeof(WorkerGlobalScope) === 'undefined' || !(self instanceof WorkerGlobalScope)) {
    // @ts-ignore
    components.AceEditor = () => import("vue2-ace-editor").then((module) => module.default);
}

@Component({ components })
export default class CodeEditor extends Vue {

    @Prop({ type: String })
    value!: string;

    editorInit() {
        console.log("ASDF");
        require('brace/ext/language_tools');
        require('brace/mode/javascript');
        require('brace/theme/chrome');
        require('brace/snippets/javascript');
    }

}
</script>

