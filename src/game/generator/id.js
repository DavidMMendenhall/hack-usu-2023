let idGen = (()=>{
    let nextId = 1;
    return {
        get next(){
            return nextId++;
        }
    }
})();
export {idGen}