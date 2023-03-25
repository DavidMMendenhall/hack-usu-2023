// @ts-check
import { generateMaze } from "./maze.js";
import { randomInt, selectWeighted, drawRandom } from "../../util/random.js";

function World(){
    const WORLD_SIZE = 9;
    /** @type {{up:number, left:number, right:number, down:number}[][]} */
    let cells = generateMaze(WORLD_SIZE);
    let startPos = {
        row: randomInt(0, WORLD_SIZE),
        col: randomInt(0, WORLD_SIZE)
    }

    let cannidateBossCells = [];
    for(let row = 0; row < cells.length; row++){
       for(let col = 0; col < cells[row].length; col++){
            let cell = cells[row][col];
            if(sumOpenings(cell) == 1 && !(row == startPos.row && col == startPos.col)){
                cannidateBossCells.push({row:row,col:col});
            }
       }
    }

    if(cannidateBossCells.length == 0){
        throw 'Could not find a suitable location for the boss'
    }
    
    let bossCellCannidateIndex = randomInt(0, cannidateBossCells.length);
    let bossCell = cannidateBossCells[bossCellCannidateIndex];

    // Cell type generation
    /** @type {WorldCell[][]}[*/
    let worldCells = [];
    for(let row = 0; row < WORLD_SIZE; row++){
        let cRow = [];
        for(let col = 0; col < WORLD_SIZE; col++){
            cRow.push(GenerateRandomWorldCell(cells[row][col]));
        }
        worldCells.push(cRow);
    }
    
    console.log(worldCells);
    return {
        cells: worldCells,
    }

}
/**
 * @typedef WorldCell
 * @property {string} name
 * @property {Object.<string, number>} chests
 * @property {Object.<string, number>} doors 0 indicates an open path, other number indicates id of item required
 * @property {{up:number,left:number,right:number,down:number}} walls
 * @property {Object.<string, number>} enemies 
 */

/**
 * @param {{up:number, left:number, right:number, down:number}} cell
 */
function GenerateRandomWorldCell(cell){
    let type = selectWeighted(cellTypeDefs);
    return CreateCell(type, cell)
}

/**
 * 
 * @param {number} type 
 * @param {{up:number, left:number, right:number, down:number}} cell
 * @returns {WorldCell}
 */
function CreateCell(type, cell){
    let def = cellTypeDefs[type];
    let chestCount = randomInt(def.chest.min, def.chest.max);
    let chestOptions = ['up', 'down', 'left', 'right'];
    let chests = {};

    let enemies = {};

    while(chestCount > 0 && chestOptions.length > 0){
        chestCount --;
        chests[drawRandom(chestOptions)] = -1;
    }

    let directions = ['up', 'down', 'left', 'right'];
    let doors = {};
    let walls = {};
    for(let i = 0; i < directions.length; i++){
        if(cell[directions[i]] == 0){
            doors[directions[i]] = 0;
        }
        walls[directions[i]] = cell[directions[i]];
    }

    return {
        type: cellTypeDefs[type].name,
        // @ts-ignore
        chests: chests,
        // @ts-ignore
        enemies: enemies,
        // @ts-ignore
        doors: doors, // 0 means open, other number indicates item number/type needed
        // @ts-ignore
        walls: walls
    }
}

let sumOpenings = (cell)=>{
    let total = 0;
    if(cell.up == 0){
        total ++;
    }
    if(cell.down == 0){
        total ++;
    }
    if(cell.left == 0){
        total ++;
    }
    if(cell.right == 0){
        total ++;
    }
    return total;
}

/**
 * @typedef Range
 * @property {number} min
 * @property {number} max
 */
/**
 * @typedef CellGenDef
 * @property {string} name
 * @property {number} weight
 * @property {Range} chest
 * @property {Range} enemy
 */

let cellTypeDefs = [
    {
        name: 'startRoom',
        weight: 0,
        chest:{
            min: 1,
            max: 2
        },
        enemy:{
            min: 0,
            max: 0,
        }
    },
    {
        name: 'bossRoom',
        weight: 0,
        chest:{
            min: 0,
            max: 0
        },
        enemy:{
            min: 1,
            max: 1
        }
    },
    {
        name: 'empty',
        weight: 1,
        chest:{
            min: 0,
            max: 0
        },
        enemy:{
            min: 0,
            max: 0
        }
    },
    {
        name: 'normal',
        weight: 2,
        chest:{
            min: 0,
            max: 1
        },
        enemy:{
            min: 0,
            max: 1
        }
    },
    {
        name: 'hard',
        weight: 1,
        chest:{
            min: 0,
            max: 3
        },
        enemy:{
            min: 2,
            max: 3
        }
    }
]

export { World };