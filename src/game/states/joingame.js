// @ts-check
import "../../engine/menu.js";
import "../../engine/render.js";
import {State} from "../../engine/state.js";
import {joinRoom, createRoom} from "../../util/database.js";

function JoinGameState() {
	return State({
		initialize() {
			while (!this.roomCode) {
				this.roomCode = prompt("Enter the room code:");
			}

			while (!this.name) {
				this.name = prompt("Choose a name:");
			}

			this.room = joinRoom(this.name, this.roomCode);
			localStorage["roomCode"] = this.roomCode;
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
      tx.ctx.restore();
		},
	});
}

export { JoinGameState };
