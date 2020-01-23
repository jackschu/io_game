import Constants from '../../Constants';
import { latency } from './client.js';
import { tickState } from './ball';
let states = new WeakMap();
let serverClientGap;
let historyDuration = 0;
let frames = [];

function clientTime() {
    return Date.now() + serverClientGap;
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

//@nocommit, naive for now
export function onServerState(serverState) {
    let dt = Max(0, historyDuration - latency);
    historyDuration -= dt;
    while (frames.length > 0 && dt > 0) {
        if (dt >= frames[0].dt) {
            dt -= frames[0].dt;
            frame.shift();
        } else {
            let t = 1 - dt / frames[0].dt;
            frames[0].dt -= dt;
            frames[0].dXpos *= t;
            frames[0].dYpos *= t;
            frames[0].dZpos *= t;
            frames[0].dXvel *= t;
            frames[0].dYvel *= t;
            frames[0].dZvel *= t;
            frames[0].dXang *= t;
            frames[0].dYang *= t;
            frames[0].dZang *= t;
            break;
        }
    }
}

export function generateNextFrame(latest, players, dt) {
    let next = tickState(latest, dt);
    let frame = {
        dt: dt,
        dXpos: next.Xpos - latest.Xpos,
        dYpos: next.Ypos - latest.Ypos,
        dZpos: next.Zpos - latest.Zpos,
        dXvel: next.Xvel - latest.Xvel,
        dYvel: next.Yvel - latest.Yvel,
        dZvel: next.Zvel - latest.Zvel,
        dXang: next.Xang - latest.Xang,
        dYang: next.Yang - latest.Yang,
        dZang: next.Zang - latest.Zang,
    };
    historyDuration += dt;
    frames.push(frame);
    return next;
}

export function addState(rawState, timestamp, obj) {
    if (!states.has(obj)) {
        states.set(obj, []);
    }

    serverClientGap = timestamp - Date.now();
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
