import { Component, Prop, Vue } from "vue-property-decorator";
import { CreateElement } from 'vue';

@Component({
    template: `<textarea v-model="value" class="w-100" rows="10"></textarea>`
})
export default class StringListOption extends Vue {

    @Prop({ type: String, default: "" })
    value!: string;

    render(h: CreateElement) {
        return h('textarea', {
            directives: [{ name: "model", value: this.value, expression: "value" }],
            staticClass: "w-100",
            attrs: { rows: "6" },
            domProps: { value: this.value },
            on: {
                input: ($event: any) => { this.$emit("input", $event.target.value); }
            }
        });
    }

}
