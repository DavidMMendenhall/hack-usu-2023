// @ts-check
import {Texture} from "../../engine/render.js";
import {State} from "../../engine/state.js";
import {Cell} from "../structures/cell.js";
import {World} from "../generator/world.js";

function CellTestState() {
	return State({
		initialize() {
			this.maze = World('bob').cells;
			this.cell = new Cell(this.maze[0][0]);
			this.registerKey("s", {
				"down": () => {
					this.cy ++;
					if(this.cy >= 9){
						this.cy = 8;
					}
					updateCell();
				},
			});
			this.registerKey("a", {
				"down": () => {
					this.cx --;
					if(this.cx < 0){
						this.cx = 0;
					}
					updateCell();
				},
			});
			this.registerKey("w", {
				"down": () => {
					this.cy --;
					if(this.cy < 0){
						this.cy = 0;
					}
					updateCell();
				},
			});
			this.registerKey("d", {
				"down": () => {
					this.cx ++;
					if(this.cx >= 9){
						this.cx = 8;
					}
					updateCell();
				},
			});

			let updateCell = ()=>{
				this.cell=new Cell(this.maze[this.cy][this.cx]);
			};
		},

		update(delta) {

		},
		cx: 0,
		cy: 0,

		/**
		 * @param {Texture} tx
		 */
		render(tx) {
			this.cell.draw(tx);
		},
	});
}

export { CellTestState };
