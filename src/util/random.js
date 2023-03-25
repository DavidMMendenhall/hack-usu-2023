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

export {generateCode, randomInt}