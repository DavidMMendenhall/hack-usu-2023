// @ts-check
import {State} from "../../engine/state.js";
import {Cell} from "../structures/cell.js";
import {World} from "../generator/world.js";
import {BoundingBox} from "../../engine/collision.js";
import {Texture} from "../../engine/render.js";
import {ChestTile, DoorTile} from "../structures/tile.js";
import {ScrollingState} from "./scrolling.js";
import {getItemColor} from "../generator/keycolor.js";

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
			this.cx = this.world.start.col;
			this.cy = this.world.start.row;
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

			this.registerKey(' ', {
				"down": () => {
					for (const c of this.chests) {
						let pbb = this.player.bb;
						let cbb = c.bb;

						let dist = Math.sqrt((pbb.cx - cbb.cx)**2 + (pbb.cy - cbb.cy)**2);

						if (dist < 2) {
							let retrievedItem = c.tile.content;
							c.tile.content = 0;

							if (!retrievedItem) {
								continue;
							}
							this.room.collectItem(retrievedItem);
						}
					}

					for (const k of Object.keys(this.doors)) {
						let d = this.doors[k];
						let pbb = this.player.bb;
						let dbb = d.bb;

						let dist = Math.sqrt((pbb.cx - dbb.cx)**2 + (pbb.cy - dbb.cy)**2);

						if (dist < 2 && d.tile.unlockItem != 0 && this.world.items[d.tile.unlockItem].collected) {
							d.tile.unlockItem = 0;
						}
					}
				}
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
			for (const dir of Object.keys(this.doors)) {
				let door = this.doors[dir];
				if (door.tile.unlockItem == 0 && nextBoundingBox.collidesWith(door.bb)) {
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

			tx.ctx.fillStyle = "#fff";
			tx.ctx.textAlign = "left";
			tx.ctx.font = "25px Arial";

			tx.ctx.fillText(`${Object.keys(this.world.items).length} items in this world`, 10, 35);

			Object.keys(this.world.items).forEach((k, idx) => {
				let item = this.world.items[k];
				let color = getItemColor(k);

				if (item.collected) {
					tx.ctx.fillStyle = color;
					tx.ctx.fillRect(
						30 + 30 * idx,
						45,
						25,
						25,
					);
				} else {
					tx.ctx.strokeStyle = `${color}`;
					tx.ctx.strokeRect(
						30 + 30 * idx,
						45,
						25,
						25
					);
				}
			});
		},

		updateCell() {
			let cell =  new Cell(this.maze[this.cy][this.cx]);
			this.staticBodies = [];
			this.doors = {};
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
							this.doors[tile.direction] = { tile: tile, bb: bb };
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
