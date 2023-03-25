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

    let playerListeners = {};
    let gameListeners = {};

    // @ts-ignore
    let firebasePlayerRef = firebase.database().ref('/rooms/'+ this.roomCode +'/players')

    let updatePlayers = (data)=>{
        let newPlayers = data.val();
        if(newPlayers){
            let playerCodes = Object.getOwnPropertyNames(newPlayers);
            for(let i = 0; i < playerCodes.length; i++){
                this.players[playerCodes[i]] = newPlayers[playerCodes[i]];
            }

            let keys = Object.getOwnPropertyNames(playerListeners);
            for(let i = 0; i < keys.length; i++){
                playerListeners[keys[i]]();
            }
        }
    }
    firebasePlayerRef.on('value', updatePlayers);

    /**
     * 
     * @param {(players:{})=>void} callback
     * @returns id of listener, use to unsubscribe
     */
    this.subcribeToGameUpdates = (callback)=>{
        let code = generateCode(10);
        playerListeners[code] = callback;
        return code;
    }

    /**
     * 
     * @param {(game:{})=>void} callback 
     * id of listener, use to unsubscribe
     */
    this.subcribeToGameUpdates = (callback)=>{
        let code = generateCode(10);
        gameListeners[code] = callback;
        return code;
    }

    this.unsubscribeListener = (code) => {
        delete playerListeners[code];
        delete gameListeners[code];
    }
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


    return {
        room: new Room(roomData),
        player: player
    };
}

/**
 * 
 * @param {string} playerName 
 * @param {string} roomCode 
 */
async function joinRoom(playerName, roomCode){
    let roomInfo;
    let player = new Player(playerName, generateCode(6));
    // @ts-ignore
    roomInfo = await firebase.database().ref("/rooms/" + roomCode).get();
    if(roomInfo.val() == null){
        return null;
    }
    let room = new Room(roomInfo.val());
    // @ts-ignore
    firebase.database().ref("/rooms/" + roomCode + '/players/' + player.code).set(player.getData());
    return {
        room: room,
        player: player
    };

}

async function openRoom(roomCode){
    let roomInfo;
    // @ts-ignore
    roomInfo = await firebase.database().ref("/rooms/" + roomCode).get();
    if(roomInfo.val() == null){
    
    return null;
    }
    
    let room = new Room(roomInfo.val());
    return{
        room: room,
    };

}


export{createRoom, joinRoom, openRoom}