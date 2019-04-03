<template lang="pug">
div.bg-dark.text-light
    .container.mt-3
        form
            div.form-group
                label Number of data points to generate
                input.form-control(type="number", v-model="tempBatchCount")
            button.btn.btn-primary(type="button", @click="save") Save
            button.btn.btn-outline-light.ml-2(type="button", @click="back") Cancel
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class Settings extends Vue {

    tempBatchCount = "0";

    @Prop()
    value!: any;

    @Watch("value", { immediate: true })
    updateSettings() {
        this.tempBatchCount = this.value.batchCount;
    }

    save() {
        this.$emit("input", {
            batchCount: parseInt(this.tempBatchCount, 10)
        });
        this.back();
    }

    back() {
        this.$router.back();
    }

}
</script>
