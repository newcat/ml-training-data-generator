<template>
    <div class="d-flex align-items-center">
        <div v-if="!editmode" class="flex-grow-1">{{ name }}</div>
        <dark-input v-else class="flex-grow-1" v-model="tempname"></dark-input>
        <button class="dark-button ml-2 pl-2 pr-2" @click="toggle">{{ editmode ? "Save" : "Edit" }}</button>
        <button class="dark-button ml-2 pl-2 pr-2" @click="$emit('remove')">Remove</button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Options } from "baklavajs";

@Component({
    components: {
        DarkInput: Options.InputOption
    }
})
export default class InterfaceView extends Vue {

    @Prop()
    name!: string;

    editmode = false;
    tempname = "";

    toggle() {
        if (!this.editmode) {
            this.tempname = this.name;
            this.editmode = true;
        } else {
            this.editmode = false;
            this.$emit("rename", this.tempname);
        }
    }

}
</script>
