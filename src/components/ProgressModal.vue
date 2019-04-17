<template lang="pug">
.modal.fade
    .modal-dialog.modal-dialog-centered
        .modal-content
            .modal-header
                h4 Calculating
            .modal-body
                .progress
                    .progress-bar(:style="{ width: progress + '%' }")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import $ from "jquery";

@Component
export default class ProgressModal extends Vue {

    @Prop()
    open!: boolean;

    @Prop()
    progress!: number;

    mounted() {
        ($(this.$el) as any).modal("hide");
    }

    @Watch("open")
    onOpenChange() {
        if (this.open) {
            ($(this.$el) as any).modal("show");
        } else {
            setTimeout(() => ($(this.$el) as any).modal("hide"), 500);
        }
    }

}
</script>
