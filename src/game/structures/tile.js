// @ts-check

import {rotationFromDirection} from "../../engine/render.js";
import {Texture} from "../../engine/render.js";
import { getItemColor } from "../generator/keycolor.js";

class Tile {
	collides = false;

  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#dd7777";
    tx.ctx.fillRect(x, y, w, h);
  }
}

class WallTile extends Tile {
	collides = true;

  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#E5C883";
    tx.ctx.fillRect(x, y, w, h);
  }
}

class BorderTile extends Tile {
	collides = true;

  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#748275";
    tx.ctx.fillRect(x, y, w, h);
  }
}

class DoorTile extends Tile {
	collides = true;

	/** @type HTMLImageElement */
  // @ts-ignore
	static doorTexture = document.getElementById("door");
	/**
	 * @param {string} direction
   * @param {number} unlockItem
	 */
	constructor(direction, unlockItem) {
		super();
		this.direction = direction;
    this.unlockItem = unlockItem;
  }

	/**
	 * @param {Texture} tx
	 */
  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = this.unlockItem == 0 ? "#dd7777" : getItemColor(this.unlockItem);
    tx.ctx.fillRect(x, y, w, h);

    tx.ctx.fillStyle = "#bb0000";
		tx.doRotated(x + w/2, y + h/2, rotationFromDirection(this.direction), () => {
			tx.ctx.drawImage(DoorTile.doorTexture, x, y, w, h);
		});
  }
}

class ChestTile extends Tile {
  collides = true;

	/** @type HTMLImageElement */
  // @ts-ignore
	static chestTexture = document.getElementById("chest");
	static openTexture = document.getElementById("chest-open");

  /**
   * 
   * @param {number} content 
   */
  constructor(content) {
		super();
		this.content = content;
  }
  draw(tx, x, y, w, h) {
    tx.ctx.fillStyle = "#dd7777";
    tx.ctx.fillRect(x, y, w, h);

    tx.ctx.drawImage(this.content == 0 ? ChestTile.openTexture : ChestTile.chestTexture, x, y, w, h);
  }
}

export { Tile, WallTile, BorderTile, DoorTile, ChestTile};
