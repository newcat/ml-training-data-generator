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
// @ts-ignore
import * as $ from "jquery";

@Component
export default class ProgressModal extends Vue {

    @Prop()
    open!: boolean;

    @Prop()
    progress!: number;

    mounted() {
        $(this.$el).modal("hide");
    }

    @Watch("open")
    onOpenChange() {
        if (this.open) {
            $(this.$el).modal("show");
        } else {
            $(this.$el).modal("hide");
        }
    }

}
</script>
