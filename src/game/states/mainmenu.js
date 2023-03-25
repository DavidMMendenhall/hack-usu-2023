import {Menu} from "../../engine/menu.js";
import {Texture} from "../../engine/render.js";
import {State} from "../../engine/state.js";
import {HostGameState} from "./hostgame.js";
import {JoinGameState} from "./joingame.js";
import {OpenGameState} from "./opengame.js";
import {CellTestState} from "./celltest.js";
import {GameState} from "./game.js";

function MainMenuState() {
	return State({
		initialize() {
			this.roomCode = localStorage.getItem("roomCode");

			let items = [
				{
					text: "Host Game",
					callback: () => this.engine.pushState(HostGameState()),
				},
				{
					text: "Join Game",
					callback: () => this.engine.pushState(JoinGameState()),
				},
				{
					text: "Cell Test",
					callback: () => this.engine.pushState(CellTestState()),
				},
				{
					text: "Gameplay Demo",
					callback: () => this.engine.pushState(GameState()),
				}
			];
			if (this.roomCode) {
				items.unshift({
					text: `Rejoin Game (${this.roomCode})`,
					callback: () => this.engine.pushState(OpenGameState()),
				})
			}

			this.menu = Menu({ items: items });

			this.menu.installKeybinds(this);
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
