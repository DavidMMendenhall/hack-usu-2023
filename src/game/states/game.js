// @ts-check
import {State} from "../../engine/state.js";
import {Cell} from "../structures/cell.js";
import {World} from "../generator/world.js";
import {BoundingBox} from "../../engine/collision.js";
import {Texture} from "../../engine/render.js";

const MOVEMENT_SPEED = 3;

function GameState() {
	return State({
		initialize() {
			this.playerTexture = document.getElementById("player");

			this.world = World();
			this.maze = this.world.cells;
			this.cx = 0;
			this.cy = 0;
			this.updateCell();

			this.registerKeys(["w", "ArrowUp"], {
				"held": () => {
					this.player.forces.y = -1;
				},
				"up": () => {
					this.player.forces.y = 0;
				},
			});

			this.registerKeys(["a", "ArrowLeft"], {
				"held": () => {
					this.player.forces.x = -1;
				},
				"up": () => {
					this.player.forces.x = 0;
				},
			});

			this.registerKeys(["s", "ArrowDown"], {
				"held": () => {
					this.player.forces.y = 1;
				},
				"up": () => {
					this.player.forces.y = 0;
				},
			});

			this.registerKeys(["d", "ArrowRight"], {
				"held": () => {
					this.player.forces.x = 1;
				},
				"up": () => {
					this.player.forces.x = 0;
				},
			});
		},

		update(delta) {
			if (this.player.forces.x || this.player.forces.y) {
				this.player.angle = Math.atan2(this.player.forces.y, this.player.forces.x);
			}

			let dx = 0;
			if (this.player.forces.x) {
				dx = Math.cos(this.player.angle) * delta * MOVEMENT_SPEED;
			}

			let dy = 0;
			if (this.player.forces.y) {
				dy = Math.sin(this.player.angle) * delta * MOVEMENT_SPEED;
			}

			let prevX = this.player.bb.x1;
			let prevY = this.player.bb.y1;

			let nextX = prevX + dx;
			let nextY = prevY + dy;

			let nextBoundingBox = new BoundingBox({
				x: nextX,
				y: nextY,
				w: this.player.bb.w,
				h: this.player.bb.h,
			});

			console.log("next frame");
			for (const bb of this.staticBodies) {
				if (nextBoundingBox.collidesWith(bb)) {
					console.log(nextBoundingBox.cx, bb.cx, nextBoundingBox.cy, bb.cy);
					if (nextBoundingBox.cx < bb.cx && this.player.forces.x > 0) {
						console.log("left");
						//nextX = bb.x1 - nextBoundingBox.w;
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.x1 = nextX;
					}

					if (nextBoundingBox.cx > bb.cx && this.player.forces.x < 0) {
						console.log("right");
						//nextX = bb.x2;
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.x1 = nextX;
					}

					if (nextBoundingBox.cy < bb.cy && this.player.forces.y > 0) {
						console.log("up");
						//nextY = bb.y1 - nextBoundingBox.h;
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.y1 = nextY;
					}

					if (nextBoundingBox.cy > bb.cy && this.player.forces.y < 0) {
						console.log("down");
						//nextY = bb.y2;
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.y1 = nextY;
					}
				}
			}

			// for (const bb of this.staticBodies) {
			// 	if (this.player.bb.collidesWith(bb)) {
			// 		if (this.player.bb.cx < bb.cx) {
			// 			if (this.player.forces.x > 0) {
			// 				nextX = bb.x1 - this.player.bb.w;
			// 			} else if (this.player.forces.x > 0) {
			// 				nextX = bb.x1 - this.player.bb.w - 0.05;
			// 			}
			// 		}

			// 		else if (this.player.bb.cx > bb.cx) {
			// 			if (this.player.forces.x < 0) {
			// 				nextX = bb.x2;
			// 			} else if (this.player.forces.x > 0) {
			// 				nextX = bb.x2 + 0.05;
			// 			}
			// 		}

			// 		if (this.player.bb.cy < bb.cy) {
			// 			if (this.player.forces.y > 0) {
			// 				nextY = bb.y1 - this.player.bb.h;
			// 			} else if (this.player.forces.y < 0) {
			// 				nextY = bb.y1 - this.player.bb.h - 0.05;
			// 			}
			// 		}

			// 		else if (this.player.bb.cy > bb.cy) {
			// 			if (this.player.forces.y < 0) {
			// 				nextY = bb.y2;
			// 			} else if (this.player.forces.y > 0) {
			// 				nextY = bb.y2 + 0.05;
			// 			}
			// 		}
			// 	}
			// }

			this.player.bb.x1 = nextX;
			this.player.bb.y1 = nextY;
		},

		/**
		 * @param {Texture} tx
		 */
		render(tx) {
			this.cell.draw(tx);

			tx.ctx.save();
			let tileWidth = Math.min(
				0.8 * tx.canvas.width / this.cell.tilesX,
				0.8 * tx.canvas.height / this.cell.tilesY,
			);

			tx.ctx.translate(
				tx.canvas.width / 2 - this.cell.tilesX * tileWidth / 2,
				tx.canvas.height / 2 - this.cell.tilesY * tileWidth / 2
			);

			tx.ctx.scale(tileWidth, tileWidth);

			tx.doRotated(
				this.player.bb.cx,
				this.player.bb.cy,
				this.player.angle + Math.PI / 2,
				() => {
					tx.ctx.drawImage(
						this.playerTexture,
						this.player.bb.x1,
						this.player.bb.y1,
						1,
						1,
					);
				}
			);

			// tx.ctx.strokeRect(
			// 	this.player.bb.x1,
			// 	this.player.bb.y1,
			// 	this.player.bb.w,
			// 	this.player.bb.h
			// );

			tx.ctx.restore();
		},

		updateCell() {
			let cell =  new Cell(this.maze[this.cy][this.cx]);
			this.staticBodies = [];
			cell.tiles.forEach((line, yi) => {
				line.forEach((tile, xi) => {
					if (tile.collides) {
						this.staticBodies.push(new BoundingBox({
							x: xi,
							y: yi,
							w: 1,
							h: 1,
						}));
					}
				});

				this.cell = cell;

				this.player = {
					bb: new BoundingBox({
						cx: this.cell.tilesX / 2,
						cy: this.cell.tilesY / 2,
						w: 1,
						h: 1,
					}),
					angle: Math.PI / 2,
					forces: {
						x: 0,
						y: 0,
					}
				};

			});
		}
	});
}

export { GameState };
