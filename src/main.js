// @ts-check
import { generateCode } from "./util/random.js";
import { createRoom, joinRoom} from "./util/database.js";
import { Engine } from "./engine/engine.js";
import { MainMenuState } from "./game/states/mainmenu.js";

// console.log(firebase)
let room = createRoom('bob').room;

joinRoom('sarah', room.roomCode);

let engine = Engine({
  viewportId: "viewport",
  initialState: MainMenuState(),
});

engine.start();

export { engine };
