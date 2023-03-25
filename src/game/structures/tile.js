// @ts-check

import {rotationFromDirection} from "../../engine/render.js";
import {Texture} from "../../engine/render.js";

class Tile {
  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#dd7777";
    tx.ctx.fillRect(x, y, w, h);
  }
}

class WallTile extends Tile {
  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#bb0000";
    tx.ctx.fillRect(x, y, w, h);
  }
}

class BorderTile extends Tile {
  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#880000";
    tx.ctx.fillRect(x, y, w, h);
  }
}

class DoorTile extends Tile {
	/** @type HTMLImageElement */
	static doorTexture = document.getElementById("door");
	/**
	 * @param {string} direction
	 */
	constructor(direction) {
		super();
		this.direction = direction;
  }

	/**
	 * @param {Texture} tx
	 */
  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#dd7777";
    tx.ctx.fillRect(x, y, w, h);

    tx.ctx.fillStyle = "#bb0000";
		tx.doRotated(x + w/2, y + h/2, rotationFromDirection(this.direction), () => {
			tx.ctx.drawImage(DoorTile.doorTexture, x, y, w, h);
		});
  }
}

export { Tile, WallTile, BorderTile, DoorTile };
