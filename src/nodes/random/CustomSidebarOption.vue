<template>
<div>
    <h3>Custom Distribution</h3>
    <p> Mein Wert: {{value.hure}} </p>
    <custom-editor></custom-editor>
    <button @click="test" class="dark-button mt-3 w-100">Test</button>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CustomEditor from "./CustomEditor.vue";

@Component({
    components: {  CustomEditor }
})
export default class CodeOption extends Vue {

    @Prop()
    value!: any;

    test() {
        console.log(this.value.hure);
    }

}
</script>
