// @ts-check
import {Texture} from "../../engine/render.js";
import {State} from "../../engine/state.js";
import {Cell} from "../structures/cell.js";
import {generateMaze} from "../generator/maze.js";

function CellTestState() {
	return State({
		initialize() {
			this.maze = generateMaze(9);
			this.cell = new Cell(this.maze[5][0]);
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
