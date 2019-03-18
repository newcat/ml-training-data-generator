import { Component, Prop, Vue } from "vue-property-decorator";
import { Node, Options } from "baklavajs";
import { CreateElement } from 'vue';

@Component({
    template: `<textarea v-model="value" class="w-100" rows="10"></textarea>`
})
class StringListOption extends Vue {

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

export default class StringListNode extends Node {

    type = "StringListNode";
    name = this.type;

    constructor() {
        super();
        // TODO: Replace with IntegerOption
        this.addInputInterface("Index", "number", Options.NumberOption, 0);
        this.addOption("Strings", StringListOption, "String 1\nString 2");
        this.addOutputInterface("String", "string");
    }

    calculate() {
        const arr = (this.getOptionValue("Strings") as string).split("\n");
        const i = Math.floor(this.getInterface("Index").value);
        let value = "";
        if (i >= 0 && i < arr.length) {
            value = arr[i];
        }
        this.getInterface("String").value = value;
    }

}
