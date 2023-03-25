class Texture {
  constructor(id) {
	/** @type HTMLCanvasElement */
	this.canvas = document.getElementById(id);
	/** @type CanvasRenderingContext2D */
	this.ctx = this.canvas.getContext("2d");
  }

  doRotated(x, y, angle, func) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.translate(-x, -y);

    func();

    this.ctx.restore();
  }
}

function rotationFromDirection(str) {
  switch (str) {
    case "n":
      return 0;
    case "e":
      return Math.PI / 2;
    case "s":
      return Math.PI;
    case "w":
      return Math.PI * 3 / 2;
  }
}

function timeString(num) {
  return `${(num / 60 / 1000) | 0}min ${(num / 1000 % 60) | 0}sec`;
}

export { Texture, rotationFromDirection, timeString };
