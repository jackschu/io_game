import Constants from '../../Constants';

let states = {};
let serverClientGap;

function clientTime() {
    return new Date().getTime() + serverClientGap;
}

function getBaseState(obj) {
    let curTime = clientTime();
    let stateArr = states[obj.hash()];
    for (let i = stateArr.length - 1; i >= 0; i--) {
        if (curTime - stateArr[i].timestamp >= Constants.RENDER_DELAY) {
            return i;
        }
    }
    return -1;
}

function interpolate(curState, nextState, ratio) {
    let newState = {};
    Object.keys(curState.data).forEach(key => {
        newState[key] =
            curState.data[key] +
            (nextState.data[key] - curState.data[key]) * ratio;
    });
    return newState;
}

export function addState(rawState, timestamp, obj) {
    if (states[obj.hash()] === undefined) {
        states[obj.hash()] = [];
    }

    serverClientGap = timestamp - new Date().getTime();

    let state = {
        timestamp: timestamp,
        data: rawState,
    };

    states[obj.hash()].push(state);
    const base = getBaseState(obj);
    if (base > 0) {
        states[obj.hash()].splice(0, base);
    }
}

export function generateCurrentState(obj) {
    if (states[obj.hash()] === undefined) {
        states[obj.hash()] = [];
    }
    
    let curTime = clientTime();
    let stateArr = states[obj.hash()];
    let i = getBaseState(obj);

    if (i == -1) {
        return null;
    }

    let curState = stateArr[i];
    if (i < stateArr.length - 1) {
        let nextState = stateArr[i + 1];
        let ratio =
            (curTime - Constants.RENDER_DELAY - curState.timestamp) /
            (nextState.timestamp - curState.timestamp);
        return interpolate(curState, nextState, ratio);
    } else {
        return curState.data;
    }
}

export function deleteStates(obj) {
    delete states[obj.hash()];
}
