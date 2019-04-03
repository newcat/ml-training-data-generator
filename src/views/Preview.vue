<template lang="pug">
div.bg-dark.text-light
    .container.mt-3
        table.table.table-dark
            thead
                tr
                    th(v-for="header in headers", :key="header") {{ header }}
            tbody
                tr(v-for="(row, i) in rows", :key="i")
                    td(v-for="(v, j) in row", :key="j") {{ v }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import AppVue from "@/App.vue";
import { IResult } from "@/calculator";

@Component
export default class Preview extends Vue {

    @Inject("app")
    app!: AppVue;

    previewData = "";

    async mounted() {
        const r = await this.app.c.runBatch(20);
        if (!r) { return; }
        this.previewData = r.data;
    }

    get headers() {
        return this.previewData.split("\n", 1)[0].split(";");
    }

    get rows() {
        return this.previewData.split("\n").slice(1).map((s) => s.split(";"));
    }

}
</script>
