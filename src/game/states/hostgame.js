// @ts-check
import "../../engine/menu.js";
import "../../engine/render.js";
import {State} from "../../engine/state.js";
import {createRoom} from "../../util/database.js";

function HostGameState() {
	return State({
		initialize() {
			while (!this.name) {
				this.name = prompt("Choose a name:");
			}

			let params = createRoom(this.name);
			this.room = params.room;
			this.playerId = params.player;

			localStorage["roomCode"] = this.room.roomCode;
			console.log(this.room);
		},

		update(delta) {
		},

		render(tx) {
      // tx.ctx.drawImage(this.bg, 0, 0, tx.canvas.width, tx.canvas.height);
      tx.ctx.save();
      tx.ctx.translate(tx.canvas.width / 2, 150);
			tx.ctx.fillStyle = "black";
			tx.ctx.textAlign = "center";
			tx.ctx.font = "30px Arial";
			tx.ctx.fillText("Your room code is:", 0, 0);

			tx.ctx.font = "100px Arial";
			tx.ctx.fillText(this.room.roomCode, 0, 120);

			tx.ctx.translate(0, 250);
			tx.ctx.font = "30px Arial";
			tx.ctx.fillText("Players here now:", 0, -35);

			tx.ctx.font = "25px Arial";
			Object.keys(this.room.players)
				.map(k => this.room.players[k])
				.forEach((player, idx) => {
					tx.ctx.fillText(player.name, 0, idx * 30);
				});
      tx.ctx.restore();
		},
	});
}

export { HostGameState };
