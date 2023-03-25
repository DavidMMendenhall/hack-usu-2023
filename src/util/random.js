// @ts-check
/**
 * Generates a random numeric code of the given length
 * @param {number} length 
 * @returns string
 */
let generateCode = (length) => {
    let result = "";
    for(let i = 0; i < length; i++){
        result += randomInt(0, 10).toString();
    }
    return result;
}

/**
 * Generates a random integer
 * @param {number} a Lower bound (inclusive)
 * @param {number} b Upper bound (exclusive)
 */
let randomInt = (a, b) => {
    return Math.floor((b - a) * Math.random() + a);
} 

/**
 * 
 * @param {{weight:number}[]} options 
 */
let selectWeighted = (options) => {
    let totalWeight = 0;
    for(let i = 0; i < options.length; i++){
        totalWeight += options[i].weight;
    }
    let selectedWeight = Math.random() * totalWeight;
    for(let i = 0; i < options.length; i++){
        selectedWeight -= options[i].weight;
        if(selectedWeight <= 0){
            return i;
        }
    }
    return -1;
}


/**
 * selects a random item, removes it from the list and returns it.
 * @param {{}} items 
 */
let drawRandom = (items) => {
    let keys = Object.getOwnPropertyNames(items);
    let randomIndex = randomInt(0, keys.length);
    if(keys.length == 0){
        return [undefined, undefined];
    }
    let sel = items[keys[randomIndex]];
    delete items[keys[randomIndex]];
    return [sel, keys[randomIndex]];
}

export {generateCode, randomInt, selectWeighted, drawRandom}