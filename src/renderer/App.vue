<template>
    <ul>
        <li
            v-for="item in items"
            :key="item"
        >{{ item }}</li>
    </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class  extends Vue {

    items = [ "Item 1", "Item 2", "Item 3" ];

}
</script>
