// @ts-check

import {Texture} from "../../engine/render.js";
import {Tile, WallTile, BorderTile, DoorTile} from "./tile.js";

class Cell {
	/**
	 * Makes a cell out of a MazeCell
	 */
	constructor(mc) {
		this.cellsX = 11;
		this.cellsY = 9;
		/** @type Array<Array<Tile>> */
		this.tiles = [];
		for (let y = 0; y < this.cellsY; y++) {
			let line = [];
			this.tiles.push(line);
			for (let x = 0; x < this.cellsX; x++) {
				let wall = x == 0 || y == 0 || x == this.cellsX - 1 || y == this.cellsY - 1;
				let border = (
					mc.left == -1  && x == 0 ||
					mc.up == -1    && y == 0 ||
					mc.right == -1 && x == this.cellsX - 1 ||
					mc.down == -1  && y == this.cellsY - 1
				);

				let direction = "n";

				let door = (
					mc.left  == 0 && x == 0 && y == ((this.cellsY / 2) | 0) && (direction = "w") ||
					mc.up    == 0 && y == 0 && x == ((this.cellsX / 2) | 0) ||
					mc.right == 0 && x == this.cellsX - 1 && y == ((this.cellsY / 2) | 0) && (direction = "e") ||
					mc.down  == 0 && y == this.cellsY - 1 && x == ((this.cellsX / 2) | 0) && (direction = "s")
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
			0.8 * tx.canvas.width / this.cellsX,
			0.8 * tx.canvas.height / this.cellsY,
		);
		let startX = tx.canvas.width / 2 - this.cellsX * tileWidth / 2;
		let startY = tx.canvas.height / 2 - this.cellsY * tileWidth / 2;

		this.tiles.forEach((line, yi) => {
			line.forEach((tile, xi) => {
				tile.draw(tx, startX + xi * tileWidth, startY + yi * tileWidth, tileWidth, tileWidth);
			});
		});
	}
}

export {Cell};
