import { expect } from "chai";
import ConstraintNode from "@/nodes/ConstraintNode";

describe("ConstraintNode", () => {

    it("has an 'Is Valid' input interface", () => {
        const n = new ConstraintNode();
        expect(n.interfaces.has("Is Valid")).to.be.true;
    });

});
