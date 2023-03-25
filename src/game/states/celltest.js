// @ts-check
import {Texture} from "../../engine/render.js";
import {State} from "../../engine/state.js";
import {Cell} from "../structures/cell.js";

function CellTestState() {
	return State({
		initialize() {
			this.cell = new Cell();
		},

		update(delta) {

		},

		/**
		 * @param {Texture} tx
		 */
		render(tx) {
			this.cell.draw(tx);
		},
	});
}

export { CellTestState };
