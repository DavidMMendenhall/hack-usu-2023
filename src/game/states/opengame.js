// @ts-check
import "../../engine/menu.js";
import "../../engine/render.js";
import {State} from "../../engine/state.js";
import {openRoom} from "../../util/database.js";

function OpenGameState() {
	return State({
		initialize(roomCode) {
			this.roomCode = localStorage["roomCode"];
			openRoom(this.roomCode).then((params) => {
				if (!params) {
					this.quit = true;
					return;
				}
				console.log(params);
				this.room = params.room;
				this.playerId = localStorage["playerId"];
				this.player = this.room.players[this.playerId];
			}).catch((reason) => {
				console.log(reason);
				this.quit = true;
			});
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
			if (!this.room) {
				tx.ctx.fillText("Loading...", 0, 300);
				tx.ctx.restore();
				return;
			}
			tx.ctx.fillText("You've joined room", 0, 0);

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

export { OpenGameState };