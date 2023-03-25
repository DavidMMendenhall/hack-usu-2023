// @ts-check
import {State} from "../../engine/state.js";
import {Cell} from "../structures/cell.js";
import {World} from "../generator/world.js";
import {BoundingBox} from "../../engine/collision.js";
import {Texture} from "../../engine/render.js";
import {ChestTile, DoorTile} from "../structures/tile.js";
import {ScrollingState} from "./scrolling.js";

const MOVEMENT_SPEED = 3;

function GameState(room) {
	return State({
		get multiworld() {
			return this.game.multiworld;
		},

		get world() {
			return this.multiworld.worlds[this.playerId];
		},
		
		get maze() {
			return this.world.cells;
		},

		initialize() {
			this.playerTexture = document.getElementById("player");

			this.playerId = localStorage["playerId"];
			console.log(room);
			this.room = room;
			this.game = room.game;
			this.cx = 0;
			this.cy = 0;
			this.updateCell();

			this.scrolling = false;

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

			let id = room.subcribeToGameUpdates(game => {
				console.log('game has updated');
				room.unsubscribeListener(id);
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

			let done = false;
			for (const dir of Object.keys(this.doorBoxes)) {
				if (nextBoundingBox.collidesWith(this.doorBoxes[dir])) {
					switch (dir) {
						case "n":
							this.cy--;
							break;
						case "s":
							this.cy++;
							break;
						case "e":
							this.cx++;
							break;
						case "w":
							this.cx--;
							break;
						default:
							throw "RIGGED";
					}

					console.log(nextBoundingBox);

					this.scrolling = true;
					this.engine.pushState(ScrollingState(dir));
					return;
				}
			}

			if (done) {
				return;
			}

			for (const bb of this.staticBodies) {
				if (nextBoundingBox.collidesWith(bb)) {
					if (nextBoundingBox.cx < bb.cx && this.player.forces.x > 0) {
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.x1 = nextX;
					}

					if (nextBoundingBox.cx > bb.cx && this.player.forces.x < 0) {
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.x1 = nextX;
					}

					if (nextBoundingBox.cy < bb.cy && this.player.forces.y > 0) {
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.y1 = nextY;
					}

					if (nextBoundingBox.cy > bb.cy && this.player.forces.y < 0) {
						nextX = prevX;
						nextY = prevY;
						nextBoundingBox.y1 = nextY;
					}
				}
			}

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

			tx.ctx.restore();
		},

		updateCell() {
			let cell =  new Cell(this.maze[this.cy][this.cx]);
			this.staticBodies = [];
			this.doorBoxes = {};
			this.chests = [];

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

						if (tile instanceof ChestTile) {
							this.chests.push({ tile: tile, bb: bb });
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

export { GameState };
