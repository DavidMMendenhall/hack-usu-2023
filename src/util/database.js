// @ts-check
import { generateCode } from "./random.js"


/**
 * 
 * @param {*} data
 */
let Room = function(data){
    let game = data.game;
    this.players = data.players;
    this.roomCode = data.code;

    // @ts-ignore
    let firebaseRoomRef = firebase.database().ref('/rooms/' + this.roomCode);
    // @ts-ignore
    let firebasePlayerRef = firebase.database().ref('/rooms/'+ this.roomCode +'/players')

    let updatePlayers = (data)=>{
        let newPlayers = data.val();
        if(newPlayers){
            let playerCodes = Object.getOwnPropertyNames(newPlayers);
            for(let i = 0; i < playerCodes.length; i++){
                this.players[playerCodes[i]] = newPlayers[playerCodes[i]];
            }
        }
    }
    firebasePlayerRef.on('value', updatePlayers);
}

/**
 * 
 * @param {string} name 
 * @param {string} code 
 */
let Player = function(name, code) {
    this.name = name;
    this.code = code;
    this.getData = () => {
        return {
            name:this.name
        }
    }
}

/**
 * Creates a room on the database
 * @param {string} playerName
 */
let createRoom = (playerName) => {
    let roomCode = generateCode(6);
    let player = new Player(playerName, generateCode(6));
    let roomData = {
        game:{
            generated: false
        },
        players:{},
        code: roomCode
    }
    
    roomData.players[player.code] = player.getData();
    // @ts-ignore
    firebase.database().ref("/rooms/" + roomCode).set(roomData);


    return new Room(roomData);
}

/**
 * 
 * @param {*} playerName 
 * @param {*} roomCode 
 */
async function joinRoom(playerName, roomCode){
    let roomInfo;
    // @ts-ignore
    roomInfo = await firebase.database().ref("/rooms/" + roomCode).get();
    if(roomInfo.val() == null){
    
    return null;
    }
    
    let room = new Room(roomInfo);
    let playerId = generateCode(6);
    // @ts-ignore
    firebase.database().ref("/rooms/" + roomCode + '/players/' + playerId).set({name:playerName});
    return room;

}

// creating a game

// joining a room


export{createRoom, joinRoom}