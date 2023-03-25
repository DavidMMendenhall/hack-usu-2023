// @ts-check
import { drawRandom } from "../../util/random.js";
import { convertToRegionGraph, Region } from "./graph.js";
import { World } from "./world.js";


/**
 * 
 * @param {string[]} players A list of player codes
 */
let GenerateMultiWorld = (players)=>{
    let playerCount = players.length;
    if(playerCount == 0){
        throw 'At least one player must be present for generation';
    }
    let multiworldRoot = new Region('multiworld_root', [], null, null);
    let worlds = {};
    let items = {};
    let itemMap = {};
    let itemId = 1;
    for(let i = 0; i < playerCount; i++){
        let world = World(players[i]);
        worlds[players[i]] = world;
        world.root.setParent(multiworldRoot);
        let keys = Object.getOwnPropertyNames(world.items);
        for(let i = 0; i < keys.length; i++){
            items[keys[i]] = true;
        }
    }
    console.log(worlds);
    // begin fill
    let availableLocations = {};
    let requirements = {}
    let state = {};
    getAvailable(state, multiworldRoot, availableLocations, requirements);

    while(Object.getOwnPropertyNames(requirements).length > 0){
        
        let chosenItem = drawRandom(requirements);
        let chosenLocation = drawRandom(availableLocations);
        let locs = {'up':true, 'left':true, 'right':true, 'down':true}
        while(true){
            if(!chosenLocation[0]){
                break;
            }
            let dir = drawRandom(locs)[1];
            if(chosenLocation[0][dir] == -1){
                itemMap[itemId] = {item:chosenItem[1],location:chosenLocation[0]};

                chosenLocation[0][dir] = itemId;
                state[chosenItem[1]] = true;
                itemId++;
                break;
            }
        }
        
        getAvailable(state, multiworldRoot, availableLocations, requirements);
    }
    console.log(itemMap);
    
    
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