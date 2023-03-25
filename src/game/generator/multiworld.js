// @ts-check
import { drawRandom } from "../../util/random.js";
import { convertToRegionGraph, Region } from "./graph.js";
import { World } from "./world.js";

/**
 * @typedef Item
 * @property {string} name
 * @property {boolean} collected 
 * @property {string} world 
 */
/** @typedef MultiWorld
 * @property {Object.<string, World>} worlds
 * @property {Object.<string, Item>} items
 */
/**
 * 
 * @param {string[]} players A list of player codes
 * @returns {MultiWorld}
 */
let GenerateMultiWorld = (players)=>{
    let playerCount = players.length;
    if(playerCount == 0){
        throw 'At least one player must be present for generation';
    }
    let multiworldRoot = new Region('multiworld_root', [], null, null);
    /** @type {Object.<string, World>} */ 
    let worlds = {};
    /** @type {Object.<string, Item>}  */
    let items = {};
    for(let i = 0; i < playerCount; i++){
        let world = World(players[i]);
        // @ts-ignore
        worlds[players[i]] = world;
        world.root.setParent(multiworldRoot);
        let keys = Object.getOwnPropertyNames(world.items);
        for(let i = 0; i < keys.length; i++){
            items[keys[i]] = world.items[keys[i]];
        }
    }
    console.log(worlds);
    // begin fill
    let availableLocations = {};
    let requirements = {}
    let state = {};
    getAvailable(state, multiworldRoot, availableLocations, requirements);

    while(Object.getOwnPropertyNames(requirements).length > 0){
        let chosenLocation = drawRandom(availableLocations);
        let locs = {'up':true, 'left':true, 'right':true, 'down':true}
        while(true){
            if(!chosenLocation[0]){
                break;
            }
            let dir = drawRandom(locs)[1];
            if(chosenLocation[0][dir] == -1){
                let chosenItem = drawRandom(requirements);
                chosenLocation[0][dir] = Number(chosenItem[1]);
                state[chosenItem[1]] = true;
                break;
            }
        }
        getAvailable(state, multiworldRoot, availableLocations, requirements);
    }
        
        

    for(let i = 0; i < playerCount; i++){
        // @ts-ignore
        worlds[players[i]].root = null;
    }

    
    return {
        worlds: worlds,
        items: items
    }
}

/**
 * 
 * @param {{}} state
 * @param {{}} locations
 * @param {{}} requirements
 * @param {Region} region 
 */
let getAvailable = (state, region, locations, requirements)=>{
    if(region.canAccess(state)){
        let c = region.locations.chests;
        if(c){
            if(c.up == -1 || c.down == -1 || c.left == -1 || c.right == -1){
                locations[region.name] = region.locations.chests;
            }
        }
        for(let i = 0; i < region.children.length; i++){
            getAvailable(state, region.children[i], locations, requirements);
        }
    }else{
        //console.log(region.reportAccess(state))
        for(let i = 0; i < region.requirements.length; i++){
            requirements[region.requirements[i]] = true;
        }
    }
}


export {GenerateMultiWorld}