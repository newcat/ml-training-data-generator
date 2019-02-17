<template>
    <div style="width:100%;height:90vh;">
        <baklava-editor :model="editor"></baklava-editor>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Editor } from "baklavajs";

@Component
export default class  extends Vue {

    editor = new Editor();

}
</script>
