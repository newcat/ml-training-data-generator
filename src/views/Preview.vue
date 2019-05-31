<template lang="pug">
div.bg-dark.text-light
    .container.mt-3
        button.btn.btn-primary.mb-4(type="button", @click="calculate") Recalculate
        table.table.table-dark(v-if="!isEmpty")
            thead
                tr
                    th(v-for="header in headers", :key="header") {{ header }}
            tbody
                tr(v-for="(row, i) in rows", :key="i")
                    td(v-for="(v, j) in row", :key="j") {{ v }}
        div.alert.alert-dark(v-else) No data to display.
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import AppVue from "@/App.vue";
import { IResult } from "@/calculationManager";

@Component
export default class Preview extends Vue {

    @Inject("app")
    app!: AppVue;

    previewData: Array<Record<string, any>> = [];

    mounted() {
        this.calculate();
    }

    async calculate() {
        try {
            this.previewData = await this.app.calculator.run(20);
        } catch (err) {
            this.app.errorMessage = err;
            this.app.showErrorNotification = true;
        }
    }

    get headers() {
        return this.previewData.length > 0 ? Object.keys(this.previewData[0]) : [];
    }

    get rows() {
        return this.previewData.length > 0 ? this.previewData.map((d) => Object.values(d)) : [];
    }

    get isEmpty() {
        return !this.previewData ||
            this.previewData.length === 0 ||
            this.previewData.every((d) => Object.entries(d).length === 0);
    }

}
</script>
