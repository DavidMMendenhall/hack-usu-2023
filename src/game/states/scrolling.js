// @ts-check
import {State} from "../../engine/state.js";
import {Cell} from "../structures/cell.js";
import {BoundingBox} from "../../engine/collision.js";
import {Texture} from "../../engine/render.js";
import {DoorTile} from "../structures/tile.js";

const MOVEMENT_SPEED = 3;

function ScrollingState(direction) {
	return State({
		initialize() {
			this.scrollTexture = null;
			this.internalTexture = Texture.create("scrollInternal", 1200, 900);

			if (direction == "n" || direction == "s") {
				this.scrollTexture = Texture.create("vertScroll", 1200, 1800);
			} else {
				this.scrollTexture = Texture.create("horizScroll", 2400, 900);
			}

			this.startX = direction == "w" ? 1200 : 0;
			this.startY = direction == "n" ? 900 : 0;
			this.endX = direction == "e" ? 1200 : 0;
			this.endY = direction == "s" ? 900 : 0;

			this.scrollTexture.fillStyle = "#0EF";
			this.scrollTexture.ctx.fillRect(0, 0, this.scrollTexture.canvas.width, this.scrollTexture.canvas.height);

			this.parentState.render(this.internalTexture);

			this.scrollTexture.ctx.drawImage(
				this.internalTexture.canvas,
				this.startX,
				this.startY,
				1200,
				900
			);

			this.parentState.updateCell();
			this.parentState.render(this.internalTexture);

			this.scrollTexture.ctx.drawImage(
				this.internalTexture.canvas,
				this.endX,
				this.endY,
				1200,
				900
			);

			this.endTime = 1;
			this.timeSpent = 0;
		},

		update(delta) {
			if (this.timeSpent >= this.endTime) {
				this.quit = true;
				this.parentState.scrolling = false;
			}

			this.timeSpent = Math.min(this.timeSpent + delta, this.endTime);
		},

		/**
		 * @param {Texture} tx
		 */
		render(tx) {
			tx.ctx.drawImage(
				this.scrollTexture.canvas,
				this.startX + (this.endX - this.startX) * this.timeSpent / this.endTime,
				this.startY + (this.endY - this.startY) * this.timeSpent / this.endTime,
				1200,
				900,
				0,
				0,
				1200,
				900,
			);
		},

		updateCell() {
			let cell =  new Cell(this.maze[this.cy][this.cx]);
			this.staticBodies = [];
			this.doorBoxes = {};
			cell.tiles.forEach((line, yi) => {
				line.forEach((tile, xi) => {
					if (tile.collides) {
						let bb = new BoundingBox({
							x: xi,
							y: yi,
							w: 1,
							h: 1,
						});

						this.staticBodies.push(bb);

						if (tile instanceof DoorTile) {
							this.doorBoxes[tile.direction] = bb;
						}
					}
				});

				this.cell = cell;
			});

			this.player = {
				bb: new BoundingBox({
					cx: this.cell.tilesX / 2,
					cy: this.cell.tilesY / 2,
					w: 0.8,
					h: 0.8,
				}),
				angle: Math.PI / 2,
				forces: {
					x: 0,
					y: 0,
				}
			};

		}
	});
}

export { ScrollingState };
