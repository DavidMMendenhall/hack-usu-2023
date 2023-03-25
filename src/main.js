// @ts-check
import { generateCode } from "./util/random.js";
import { createRoom, joinRoom} from "./util/database.js";

// console.log(firebase)
let room = createRoom('bob').room;

let output = await joinRoom('sarah', room.roomCode);
