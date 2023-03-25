// @ts-check
import { randomInt } from "../../util/random.js";

const CELL_CONNECTION_TYPE = {
    border: -1,
    open : 0,
    wall : 1,
}

/**
 * 
 * @param {number} row 
 * @param {number} col 
 */
function MazeCell(row, col){
    this.row = row;
    this.col = col;
    let id = MazeCell.cells.length;
    this.group = id;

    this.up = 1;
    this.down = 1;
    this.left = 1;
    this.right = 1;

    MazeCell.cells.push(this);

    this.find = () => {
        if(this.group != id){
            this.group = MazeCell.cells[this.group].find();
        }
        return this.group;
    }

    /**
     * @param {MazeCell} cell 
     */
    this.union = (cell) => {
        this.group = this.find();
        if(this.group == id){
            this.group = cell.find();
        }else{
            MazeCell.cells[this.group].union(cell);
        }
    }
}
/** @type {MazeCell[]}*/
MazeCell.cells = [];

/**
 * 
 * @param {MazeCell[][]} cells 
 */
let serializeCells = (cells) => {
    let seralizedCells = [];
    for(let row = 0; row < cells.length; row++){
        let cRow = [];
        for(let col = 0; col < cells[row].length; col++){
            let cell = cells[row][col];
            cRow.push({
                up: cell.up,
                down: cell.down,
                right: cell.right,
                left: cell.left
            });
        }
        seralizedCells.push(cRow);
    }
    return seralizedCells;
}

/**
 * 
 * @param {number} size 
 */
let generateMaze = function(size){
    let cells = [];
    let genCells = [];
    for(let i = 0; i < size; i++){
        let row = [];
        for(let j = 0; j < size; j++){
            let cell = new MazeCell(i, j);
            if(cell.row == 0){
                cell.up = -1;
            }
            if(cell.row == size - 1){
                cell.down = -1;
            } 
            
            if(cell.col == 0){
                cell.left = -1;
            }
            if(cell.col == size - 1){
                cell.right = -1;
            }
            row.push(cell);
            genCells.push(cell);
        }
        cells.push(row);
    }

    /**
     * 
     * @param {MazeCell} a 
     * @param {MazeCell} b 
     */
    let connect = (a, b) => {
        if(a.col + 1 == b.col){
            a.right = 0;
            b.left = 0;
        } else if(a.col - 1 == b.col){
            a.left = 0;
            b.right = 0;
        } else if(a.row + 1 == b.row){
            a.down = 0;
            b.up = 0;
        } else if(a.row - 1== b.row){
            a.up = 0;
            b.down = 0;
        }else{
            return;
        }
        a.union(b);
    }

    /**
     * 
     * @param {MazeCell} cell 
     * @param {string} dir 
     * @returns 
     */
    let getCellTo = (cell, dir)=>{
        switch(dir){
            case 'up':
                return cells[cell.row - 1][cell.col]
            case 'down':
                return cells[cell.row + 1][cell.col]
            case 'left':
                return cells[cell.row][cell.col - 1]
            case 'right':
                return cells[cell.row][cell.col + 1]
        }
    }

    while(genCells.length > 0){
        let cellIndex = randomInt(0,genCells.length);
        let cell = genCells[cellIndex];
        let keys = ['up', 'down', 'left', 'right'];
        let direction = null;
        while(direction === null){
            if(keys.length == 0){
                genCells.splice(cellIndex, 1);
                break;
            }
            let dir = randomInt(0, keys.length);
            if(cell[keys[dir]] == 1 && getCellTo(cell, keys[dir]).find() !== cell.find()){
                direction = keys[dir];
            }else{
                keys.splice(dir, 1);
            }
        }
        if(direction !== null){
            connect(cell, getCellTo(cell,direction));
        }
    }

    return serializeCells(cells);
}

export {generateMaze}