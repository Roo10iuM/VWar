export function createGameState(plColor) {
    const firstPl = plColor;
    const secondPl = (plColor == "red") ? "blue" : "red";
    let turn = 0;
    let newX = [];

    return {
        getFirstPl: () => firstPl,
        getSecondPl: () => secondPl,
        getTurn: () => turn,
        incTurn: () => ++turn,
        getNewX: () => newX,
        getLenNewX: () => newX.length,
        pushNewX: (x) => newX.push(x),
        spliceNewX: (x) => newX.splice(newX.indexOf(x), 1),
        resetNewX: () => newX = [],
        includesNewX: (x) => newX.includes(x), 
    }
}