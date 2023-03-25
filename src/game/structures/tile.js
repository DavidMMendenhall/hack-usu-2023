// @ts-check

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

export { Tile, WallTile };
