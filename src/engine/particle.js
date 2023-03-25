import("render");

/** @typedef { import('./types').Texture } Texture */

const particlePrototype = {
	update(delta) {
		this.x += this.xSpeed * delta;
		this.y += this.ySpeed * delta;
		this.age += delta;
		//console.log(delta, this.x, this.y);
	},

	/**Render to a canvas
	 *
	 * @param {Texture} tx
	 */
	render(tx) {
		if (this.age > this.lifetime) {
			return;
		}

		scale = 5 * (1 - this.age / this.lifetime);
		tx.ctx.fillRect(this.x - scale, this.y - scale, scale * 2, scale * 2);
	},
};

const particleGeneratorPrototype = {
	update(delta) {
		this.age += delta;
		if (this.age > this.maxLifetime) {
			return false;
		}

		for (const p of this.particles) {
			p.update(delta);
		}

		return true;
	},

	/**Render to a canvas
	 *
	 * @param {Texture} tx
	 */
	render(tx) {
		tx.ctx.fillStyle = this.color;
		for (const p of this.particles) {
			p.render(tx);
		}
	},
};

function ParticleGenerator(x, y, width, height, xSpacing, ySpacing, color) {
	let ret = {
		__proto__: particleGeneratorPrototype,
		x: x,
		y: y,
		width: width,
		height: height,
		xSpacing: xSpacing,
		ySpacing: ySpacing,
		particles: [],
		age: 0,
		maxLifetime: 0,
		color: color,
	}

	let xNumParticles = (width / xSpacing) | 0;
	let yNumParticles = (height / ySpacing) | 0;

	let particleRegionWidth = xNumParticles * xSpacing;
	let particleRegionHeight = yNumParticles * ySpacing;

	let startX = (width - particleRegionWidth) / 2;
	let startY = (height - particleRegionHeight) / 2;

	for (let i = 0; i < xNumParticles; i++) {
		for (let j = 0; j < yNumParticles; j++) {
			let angle = Math.random() * 2 * Math.PI;
			let speed = Math.random() / 10;
			let lifetime = Math.random() * 1000 + 500;

			ret.maxLifetime = Math.max(ret.maxLifetime, lifetime);

			ret.particles.push({
				__proto__: particlePrototype,
				x: x + startX + xSpacing * i,
				y: y + startY + ySpacing * j,
				age: 0,
				lifetime: lifetime,
				xSpeed: Math.cos(angle) * speed,
				ySpeed: -Math.sin(angle) * speed,
			});
		}
	}

	return ret;
}

export { ParticleGenerator };
