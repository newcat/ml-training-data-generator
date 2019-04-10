import { expect } from "chai";
import StringListNode from "@/nodes/StringListNode";

const v = `String 1
String 2
String 3`;

function getNode() {
    const n = new StringListNode();
    n.setOptionValue("Strings", v);
    return n;
}

describe("StringListNode", () => {

    it("selects the correct string", () => {
        const n = getNode();
        n.getInterface("Index").value = 2;
        n.calculate();
        expect(n.getInterface("String").value).to.equal("String 3");
    });

    it("handles out of bounds indices correctly", () => {
        const n = getNode();
        n.getInterface("Index").value = -10;
        n.calculate();
        expect(n.getInterface("String").value).to.equal("String 1");
        n.getInterface("Index").value = 10;
        n.calculate();
        expect(n.getInterface("String").value).to.equal("String 3");
    });

});
