// @ts-check
/**
 * 
 * @param {string} name Like Player 034322's cell 2,3
 * @param {string[]} requirements Items needed like ['034322_key1']
 * @param {Region | null} parent Previous room
 * @param {{row:number, col:number} | null} cell location
 */

function Region(name, requirements, parent, cell) {

    /** @type {Region[]}*/
    this.children = [];
    /**
     * @param {string} requirement 
     */
    this.addRequirement = (requirement) => {
        requirements.push(requirement);
    }

    this.canAccess = (state) => {
        for (let i = 0; i < requirements.length; i++) {
            if (!state[requirements[i]]) {
                return false;
            }
        }
        if (parent) {
            return parent.canAccess(state);
        } else {
            return true;
        }
    };

    this.reportAccess = (state) => {
        for (let i = 0; i < requirements.length; i++) {
            if (!state[requirements[i]]) {
                return 'Missing requirement for ' + name + ': ' + requirements[i];
            }
        }
        if (parent) {
            let anst = parent.canAccess(state);
            return anst ? 'Can Access ' + name : 'Parent cannot be reached for ' + name;
        } else {
            return 'Can Access ' + name;
        }
    };

    /**
     * 
     * @param {Region} newAncestor 
     */
    this.setParent = (newAncestor) => {
        newAncestor.children.push(this);
        parent = newAncestor;
    }
    if (parent) {
        this.setParent(parent);
    }

    this.getParent = () => {
        return parent;
    }
    this.requirements = requirements;

    this.cell = cell;
    this.name = name;
    this.locations = {};
};

/**
 * 
 * @param {import("./world").WorldCell[][]} worldCells
 * @param {{row:number,col:number}} start
 * @param {{row:number,col:number}} boss
 * @param {string} player
 */
let convertToRegionGraph = (worldCells, start, boss, player) => {
    let root = new Region(`${player}_root`, [], null, null);
    let visited = {};
    traverseCells(root, worldCells, start.row, start.col, boss, player, visited);
    return root;
}

/**
 * 
 * @param {Region} parent 
 * @param {import("./world").WorldCell[][]} worldCells 
 * @param {{row:number,col:number}} boss
 * @param {number}row
 * @param {number}col
 * @param {string} player 
 * @param {{}} visited 
 */
let traverseCells = (parent, worldCells, row, col, boss, player, visited) => {
    if (row < worldCells.length && row > 0 && col < worldCells[row].length && col > 0) {
        let cell = worldCells[row][col];
        if (visited[cell.name]) {
            return;
        }
        let newRegion = new Region(cell.name, [], parent, { row: row, col: col });
        newRegion.locations.chests = worldCells[row][col].chests;
        visited[cell.name] = true;

        if (cell.walls.down == 0) {
            traverseCells(newRegion, worldCells, row + 1, col, boss, player, visited);
        }
        if (cell.walls.up == 0) {
            traverseCells(newRegion, worldCells, row - 1, col, boss, player, visited);
        }
        if (cell.walls.right == 0) {
            traverseCells(newRegion, worldCells, row, col + 1, boss, player, visited);
        }
        if (cell.walls.left == 0) {
            traverseCells(newRegion, worldCells, row, col - 1, boss, player, visited);
        }
        return newRegion;
    }
}

export { convertToRegionGraph, Region }