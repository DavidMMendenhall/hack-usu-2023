import "../../engine/menu";
import "../../engine/state";

function MainMenuState() {
	return State({
		initialize() {
			this.roomCode = localStorage.getItem("roomCode");

			let items = [
				{
					text: "Host Game",
					callback: () => this.engine.pushState(HostState()),
				},
				{
					text: "Join Game",
					callback: () => this.engine.pushState(JoinState()),
				},
			];
			if (room_code) {
				items.unshift({
					text: `Rejoin Game (${this.roomCode})`,
					callback: () => this.engine.pushState(GameState(this.roomCode)),
				})
			}

			this.menu = Menu(items);
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
      this.menu.draw(tx);
      tx.ctx.restore();
		},
	});
}

export { MainMenuState };
