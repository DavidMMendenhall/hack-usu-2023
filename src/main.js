// @ts-check
import { generateCode } from "./util/random.js";
import { generateMaze } from "./game/generator/maze.js";
import { createRoom, joinRoom} from "./util/database.js";
import { GenerateMultiWorld } from "./game/generator/multiworld.js";
import { Engine } from "./engine/engine.js";
import { MainMenuState } from "./game/states/mainmenu.js";

// // console.log(firebase)
// let room = createRoom('bob').room;

// joinRoom('sarah', room.roomCode);

let engine = Engine({
  viewportId: "viewport",
  initialState: MainMenuState(),
});

// @ts-ignore
engine.start();

// @ts-ignore
window.engine = engine;

// console.log(GenerateMultiWorld(['bob']));
let room = createRoom('bob');
let mw = GenerateMultiWorld(['bob'])
room.room.setGame(mw);