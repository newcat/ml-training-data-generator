<template lang="pug">
.toast(style="position: absolute; top: 80px; right: 10px; min-width: 350px")
    .toast-header
        strong.mr-auto {{ header }}
        button.ml-2.mb-1.close(type="button", @click="close")
            span &times;
    .toast-body
        slot
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import $ from "jquery";

interface IJQToast extends JQuery<Element> {
    toast(x: any): void;
}

@Component
export default class Notification extends Vue {

    @Prop({ type: Boolean })
    value!: boolean;

    @Prop({ type: String, default: "Notification" })
    header!: string;

    internalValue = false;
    jqel!: IJQToast;

    mounted() {
        this.jqel = $(this.$el) as IJQToast;
        this.jqel.toast({ delay: 10000 });
        this.jqel.on("hidden.bs.toast", () => { this.internalValue = false; this.$emit("input", false); });
        this.jqel.on("shown.bs.toast", () => { this.internalValue = true; });
    }

    @Watch("value", { immediate: true })
    onValueChanged() {
        if (this.internalValue !== this.value) {
            if (this.value) {
                this.jqel.toast("show");
            } else {
                this.jqel.toast("hide");
            }
        }
    }

    close() {
        this.$emit("input", false);
    }

}
</script>

