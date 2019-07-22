<template lang="pug">
.modal.fade(:style="{ display: doDisplay ? 'block' : 'none' }", :class="{ show: open }")
    .modal-dialog.modal-dialog-centered
        .modal-content
            .modal-header
                h4 Calculating
            .modal-body
                .progress
                    .progress-bar(:style="{ width: progress + '%' }")
            .modal-footer
                button.btn.btn-outline-danger(@click="$emit('cancel')") Cancel
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class ProgressModal extends Vue {

    doDisplay = false;

    @Prop()
    open!: boolean;

    @Prop()
    progress!: number;

    @Watch("open")
    onOpenChange() {
        if (this.open) {
            this.doDisplay = true;
        } else {
            setTimeout(() => {
                this.doDisplay = false;
            }, 500);
        }
    }

}
</script>
