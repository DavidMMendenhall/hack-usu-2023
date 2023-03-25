// @ts-check
import { generateMaze } from "./maze.js";
import { convertToRegionGraph, Region } from "./graph.js";
import { randomInt, selectWeighted, drawRandom } from "../../util/random.js";
import { idGen } from "./id.js";
import { getItemColor } from "./keycolor.js";
/**
 * 
 * @param {string} playerCode 
 * @returns 
 */
function World(playerCode){
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
            cRow.push(GenerateRandomWorldCell(cells[row][col], row, col, playerCode));
        }
        worldCells.push(cRow);
    }

    worldCells[startPos.row][startPos.col] = CreateCell(0, cells[startPos.row][startPos.col], startPos.row, startPos.col, playerCode);
    worldCells[bossCell.row][bossCell.col] = CreateCell(1, cells[bossCell.row][bossCell.col], bossCell.row, bossCell.col, playerCode);


    
    // traverse cells and lock doors
    let worldGraph = convertToRegionGraph(worldCells, startPos, bossCell, playerCode);
    let items = {}
    
    const DOOR_LOCK_CHANCE = 0.2;

    /**
     * 
     * @param {Region} region 
     */
    let lockDoors = (region) => {
        let ancestorCell = region.getParent()?.cell;
        if(ancestorCell){
            let shouldLockDoor = Math.random() < DOOR_LOCK_CHANCE;
            if(shouldLockDoor){
                let itemId = idGen.next;
               if(ancestorCell.col + 1 == region.cell?.col){
                    worldCells[ancestorCell.row][ancestorCell.col].doors['right'] = itemId;
               }
               if(ancestorCell.col - 1 == region.cell?.col){
                    worldCells[ancestorCell.row][ancestorCell.col].doors['left'] = itemId;
                }

                if(ancestorCell.row + 1 == region.cell?.row){
                    worldCells[ancestorCell.row][ancestorCell.col].doors['down'] = itemId;
               }
               if(ancestorCell.row - 1 == region.cell?.row){
                    worldCells[ancestorCell.row][ancestorCell.col].doors['up'] = itemId;
                }
                let keyName = `${playerCode}_key_${itemId}`;
                let displayName = `${getItemColor(itemId)} Key`
                region.addRequirement(itemId);
                items[itemId] = {name:keyName, collected:false, world:playerCode, display:displayName};
            }
        }
        for(let i = 0; i < region.children.length; i++){
            lockDoors(region.children[i]);
        }
    }

    lockDoors(worldGraph);

    return {
        cells: worldCells,
        start: startPos,
        boss: bossCell,
        root: worldGraph,
        items: items
    }

}
/**
 * @typedef WorldCell
 * @property {string} name
 * @property {string} type
 * @property {Object.<string, number>} chests
 * @property {Object.<string, number>} doors 0 indicates an open path, other number indicates id of item required
 * @property {{up:number,left:number,right:number,down:number}} walls
 * @property {Object.<string, number>} enemies 
 */

/**
 * @param {{up:number, left:number, right:number, down:number}} cell
 */
function GenerateRandomWorldCell(cell, row, col, player){
    let type = selectWeighted(cellTypeDefs);
    return CreateCell(type, cell, row, col, player)
}

/**
 * 
 * @param {number} type 
 * @param {{up:number, left:number, right:number, down:number}} cell
 * @returns {WorldCell}
 */
function CreateCell(type, cell, row, col, player){
    let def = cellTypeDefs[type];
    let chests = {
        up: -1,
        left: -1,
        down: -1,
        right: -1
    };

    let enemies = {};

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
        name: `player_${player}_${row}_${col}`,
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