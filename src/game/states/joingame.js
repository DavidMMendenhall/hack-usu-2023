// @ts-check
import "../../engine/menu.js";
import "../../engine/render.js";
import {State} from "../../engine/state.js";
import {joinRoom} from "../../util/database.js";

function JoinGameState() {
	return State({
		initialize() {
			while (!this.roomCode) {
				this.roomCode = prompt("Enter the room code:");
			}

			while (!this.name) {
				this.name = prompt("Choose a name:");
			}

			joinRoom(this.name, this.roomCode).then((params) => {
				if (!params) {
					this.quit = true;
					return;
				}
				this.room = params.room;
				this.player = params.player;
				this.playerId = params.player.code;
				console.log(this.room);
			}).catch(() => {
				this.quit = true;
			});

			localStorage["roomCode"] = this.roomCode;
			localStorage["playerId"] = this.playerId;
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

export { JoinGameState };
