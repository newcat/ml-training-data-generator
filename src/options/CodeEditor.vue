<template>
    <ace-editor
        :value="value" @input="$emit('input', $event)"
        @init="editorInit" lang="javascript" theme="chrome" height="300px"
    ></ace-editor>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// @ts-ignore
import AceEditor from "vue2-ace-editor";

@Component({
    components: { AceEditor }
})
export default class CodeEditor extends Vue {

    @Prop({ type: String })
    value!: string;

    editorInit() {
        require('brace/ext/language_tools');
        require('brace/mode/javascript');
        require('brace/theme/chrome');
        require('brace/snippets/javascript');
    }

}
</script>

