<template lang="pug">
div.bg-dark.text-light
    .container.mt-3
        form
            div.form-group
                label Number of data points to generate
                input.form-control(type="number", v-model="tempBatchCount")
            div.form-group
                label Worker count (similar to threads)
                input.form-control(type="number", v-model="tempWorkerCount")
            div.form-group
                label CSV field delimiter
                input.form-control(type="text", v-model="tempCsvDelimiter")
            button.btn.btn-primary(type="button", @click="save") Save
            button.btn.btn-outline-light.ml-2(type="button", @click="back") Cancel
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class Settings extends Vue {

    tempBatchCount = "0";
    tempWorkerCount = "0";
    tempCsvDelimiter = "";

    @Prop()
    value!: any;

    @Watch("value", { immediate: true })
    updateSettings() {
        this.tempBatchCount = this.value.batchCount;
        this.tempWorkerCount = this.value.workerCount;
        this.tempCsvDelimiter = this.value.csvDelimiter;
    }

    save() {
        this.$emit("input", {
            batchCount: parseInt(this.tempBatchCount, 10),
            workerCount: parseInt(this.tempWorkerCount, 10),
            csvDelimiter: this.tempCsvDelimiter
        });
        this.back();
    }

    back() {
        this.$router.back();
    }

}
</script>
