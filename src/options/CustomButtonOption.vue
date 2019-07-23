<template>
    <button @click="onClick" class="dark-button mt-3 w-100">{{ name }}</button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Node } from '@baklavajs/core';

@Component
export default class CustomButtonOption extends Vue {

    @Prop()
    node!: Node;

    @Prop()
    name!: string;

    onClick() {
        (this.node as any).onButtonClick(this.name);
    }

}
</script>

