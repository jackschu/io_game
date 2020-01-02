import Constants from '../../Constants';

let states = new WeakMap();
let serverClientGap;

function clientTime() {
    return new Date().getTime() + serverClientGap;
}

function getBaseState(obj) {
    let curTime = clientTime();
    let stateArr = states.get(obj);
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
    if (!states.has(obj)) {
        states.set(obj, []);
    }

    serverClientGap = timestamp - new Date().getTime();

    let state = {
        timestamp: timestamp,
        data: rawState,
    };

    states.get(obj).push(state);
    const base = getBaseState(obj);
    if (base > 0) {
        states.get(obj).splice(0, base);
    }
}

export function generateCurrentState(obj) {    
    if (!states.has(obj)) {
        states.set(obj, []);
    }
    
    let curTime = clientTime();
    let stateArr = states.get(obj);
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
        // assume curState.data is non-circular, return copy
        return JSON.parse(JSON.stringify(curState.data));
    }
}

export function deleteStates(obj) {
    states.delete(obj);
}
