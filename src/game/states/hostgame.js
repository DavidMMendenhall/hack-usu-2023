import "../../engine/menu";
import "../../engine/state";
import "../../engine/render";
import "../../util/database";

/** @typedef {import("../../types").Texture} Texture */

function HostState() {
	return State({
		initialize() {
			while (!this.name) {
				this.name = prompt("Choose a name:");
			}

			this.room = createRoom(this.name);
		},

		update(delta) {
		},

		/**
		 * @param {Texture} tx
		 */
		render(tx) {
      // tx.ctx.drawImage(this.bg, 0, 0, tx.canvas.width, tx.canvas.height);
      tx.ctx.save();
      tx.ctx.translate(tx.canvas.width / 2, 150);
			tx.ctx.font = "30px Arial";
			tx.ctx.fillText("Your room code is:", 0, 0);

			tx.ctx.font = "100px Arial";
			tx.ctx.fillText(this.roomCode, 0, 50);
      tx.ctx.restore();
		},
	});
}

export { HostState };
