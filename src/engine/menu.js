import "render";
import "input";

/** @typedef { import('./types').Texture } Texture */
/** @typedef { import('./types').MenuButton } MenuButton */
/** @typedef { import('./types').Menu } Menu */
/** @typedef { import('./types').Keyboard } Keyboard */

/** @type Menu */
const menuPrototype = {
	chooseRotation() {
		this.selectedRotation = Math.random() * 0.3 - 0.15;
	},

	cursorUp() {
		if (this.selectedIdx == 0) {
			return;
		}
		
		this.chooseRotation();

		this.items[this.selectedIdx].selected = false;
		this.items[--this.selectedIdx].selected = true;
	},

	cursorDown() {
		if (this.selectedIdx == this.items.length - 1) {
			return;
		}

		this.chooseRotation();

		this.items[this.selectedIdx].selected = false;
		this.items[++this.selectedIdx].selected = true;
	},

	select() {
		this.items[this.selectedIdx].callback?.();
	},

	/**
	 * Install keybindings to move within menu
	 *
	 * @param {Keyboard} state
	 */
	installKeybinds(state) {
		state.registerKey("w", {
			"down": () => this.cursorUp(),
		});

		state.registerKey("ArrowUp", {
			"down": () => this.cursorUp(),
		});

		state.registerKey("s", {
			"down": () => this.cursorDown(),
		});

		state.registerKey("ArrowDown", {
			"down": () => this.cursorDown(),
		});

		state.registerKey("Enter", {
			"down": () => this.select(),
		});
	},

	/**
	 * Draw a menu at (0, 0) in this context
	 *
	 * @param {Texture} tx
	 */
	draw(tx) {
		tx.ctx.font = this.font;

		this.items.forEach((button, idx) => {
			tx.ctx.save();
			tx.ctx.textAlign = "center";
			tx.ctx.translate(0, this.verticalSeparation * (idx + 1));
			this.drawButton(button, tx);
			tx.ctx.restore();
		});
	},

	/**
	 * Draw a single button at (0, 0) in this context
	 *
	 * @param {MenuButton} btn
	 * @param {Texture} tx
	 */
	drawButton(btn, tx) {
		let textToFill = btn.selected ? `> ${btn.text} <` : btn.text;
		let measurement = tx.ctx.measureText(textToFill);
		tx.doRotated(0, -this.buttonHeightAbove, btn.selected ? this.selectedRotation : 0, () => {
			tx.ctx.fillStyle = btn.selected ? "#00060faa" : "#000507aa";
			tx.ctx.fillRect(-measurement.width / 2 - this.margin, -this.buttonHeightAbove, measurement.width + 2 * this.margin, this.buttonHeightAbove + this.buttonHeightBelow);

			tx.ctx.fillStyle = btn.selected ? "#e7a" : "#fff";
			tx.ctx.fillText(textToFill, 0, 0);
		});
	}
};

/** @type MenuButton */
const menuButtonPrototype = {};

/**
 * Instantiate a menu
 *
 * @param {Array} spec
 */
function Menu(spec) {
	spec.__proto__ = menuPrototype;
	spec.verticalSeparation = 75;
	spec.selectedIdx = 0;
	spec.chooseRotation();

	spec.buttonHeightAbove = 25;
	spec.buttonHeightBelow = 9;
	spec.margin = 12;
	spec.font = '25px Arial';

	spec.items.forEach((btn, idx) => {
		btn.hasOwnProperty("text") || console.warn("No text specified for menu button");
		btn.hasOwnProperty("callback") || console.warn("No callback specified for menu button");
		btn.__proto__ = menuButtonPrototype;
		btn.selected = idx == spec.selectedIdx;
	});

	return spec;
}

export { Menu };
