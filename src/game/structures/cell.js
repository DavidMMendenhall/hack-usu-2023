// @ts-check

import {Texture} from "../../engine/render.js";
import {Tile, WallTile, BorderTile, DoorTile} from "./tile.js";

class Cell {
	/**
	 * Makes a cell out of a MazeCell
	 * @param {import("../generator/world.js").WorldCell} wc
	 */
	constructor(wc) {
		this.tilesX = 11;
		this.tilesY = 9;
		/** @type {Tile[][]} */
		this.tiles = [];
		for (let y = 0; y < this.tilesY; y++) {
			let line = [];
			this.tiles.push(line);
			for (let x = 0; x < this.tilesX; x++) {
				let wall = x == 0 || y == 0 || x == this.tilesX - 1 || y == this.tilesY - 1;
				let border = (
					wc.walls.left == -1  && x == 0 ||
					wc.walls.up == -1    && y == 0 ||
					wc.walls.right == -1 && x == this.tilesX - 1 ||
					wc.walls.down == -1  && y == this.tilesY - 1
				);

				let direction = "n";

				let door = (
					wc.walls.left  == 0 && x == 0 && y == ((this.tilesY / 2) | 0) && (direction = "w") ||
					wc.walls.up    == 0 && y == 0 && x == ((this.tilesX / 2) | 0) ||
					wc.walls.right == 0 && x == this.tilesX - 1 && y == ((this.tilesY / 2) | 0) && (direction = "e") ||
					wc.walls.down  == 0 && y == this.tilesY - 1 && x == ((this.tilesX / 2) | 0) && (direction = "s")
				);

				let tile = door ? new DoorTile(direction) : border ? new BorderTile() : wall ? new WallTile() : new Tile();
				line.push(tile);
			}
		}
	}

	/**
	 * @param {Texture} tx
	 */
	draw(tx) {
		tx.ctx.fillStyle = "#000";
		tx.ctx.fillRect(0, 0, tx.canvas.width, tx.canvas.height);
		let tileWidth = Math.min(
			0.8 * tx.canvas.width / this.tilesX,
			0.8 * tx.canvas.height / this.tilesY,
		);
		let startX = tx.canvas.width / 2 - this.tilesX * tileWidth / 2;
		let startY = tx.canvas.height / 2 - this.tilesY * tileWidth / 2;

		this.tiles.forEach((line, yi) => {
			line.forEach((tile, xi) => {
				tile.draw(tx, startX + xi * tileWidth, startY + yi * tileWidth, tileWidth, tileWidth);
			});
		});
	}
}

export {Cell};
