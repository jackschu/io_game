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

export function onServerState(serverState) {
    let predictedState;
    let adjustedLatency = latency + 1;
    let dt = Math.max(0, historyDuration - adjustedLatency);
    historyDuration -= dt;

    // remove history outside of latency window
    while (frames.length > 0 && dt > 0) {
        if (dt >= frames[0].dt) {
            dt -= frames[0].dt;
            frames.shift();
        } else {
            let t = 1 - dt / frames[0].dt;
            frames[0].dt -= dt;
            frames[0].dXpos *= t;
            frames[0].dYpos *= t;
            frames[0].dZpos *= t;
            break;
        }
    }
    predictedState = JSON.parse(JSON.stringify(serverState));

    // if incoming data is sufficiently different from what we thought it would be
    // replay frame history to adjust, otherwise just apply deltas
    if (
        frames.length > 0 &&
        (Math.hypot(
            serverState.Xvel - frames[0].Xvel,
            serverState.Yvel - frames[0].Yvel,
            serverState.Zvel - frames[0].Zvel,
            serverState.Xang - frames[0].Xang,
            serverState.Yang - frames[0].Yang,
            serverState.Zang - frames[0].Zang
        ) > 7.0 ||
            Math.hypot(
                serverState.Xpos - frames[0].Xpos,
                serverState.Ypos - frames[0].Ypos,
                serverState.Zpos - frames[0].Zpos
            ) > 3.0)
    ) {
        for (let frame of frames) {
            let next = tickState(predictedState, frame.dt);
            frame.dXpos = next.Xpos - predictedState.Xpos;
            frame.dYpos = next.Ypos - predictedState.Ypos;
            frame.dZpos = next.Zpos - predictedState.Zpos;
            frame.Xpos = next.Xpos;
            frame.Ypos = next.Ypos;
            frame.Zpos = next.Zpos;
            frame.Xvel = next.Xvel;
            frame.Yvel = next.Yvel;
            frame.Zvel = next.Zvel;
            frame.Xang = next.Xang;
            frame.Yang = next.Yang;
            frame.Zang = next.Zang;
            predictedState = next;
        }
    } else {
        for (const frame of frames) {
            predictedState.Xpos += frame.dXpos;
            predictedState.Ypos += frame.dYpos;
            predictedState.Zpos += frame.dZpos;
        }
    }
    return predictedState;
}

// @nomaster check if latest is ever undefined
export function generateNextFrame(latest, players, dt, lastDisplay) {
    let adjustedLatency = latency + 1;
    let next = tickState(latest, dt);
    let frame = {
        dt: dt,
        dXpos: next.Xpos - latest.Xpos,
        dYpos: next.Ypos - latest.Ypos,
        dZpos: next.Zpos - latest.Zpos,
        Xpos: next.Xpos,
        Ypos: next.Ypos,
        Zpos: next.Zpos,
        Xvel: next.Xvel,
        Yvel: next.Yvel,
        Zvel: next.Zvel,
        Xang: next.Xang,
        Yang: next.Yang,
        Zang: next.Zang,
    };

    historyDuration += dt;
    frames.push(frame);

    // no need to smooth if no last display
    if (!lastDisplay) {
        console.log('last display is null');
        return [next, next];
    }

    // higher is more smoothing
    const convergence = 0.03;
    const extrapolatedXpos =
        latest.Xpos + next.Xvel * convergence * adjustedLatency;
    const extrapolatedYpos =
        latest.Ypos + next.Yvel * convergence * adjustedLatency;
    const extrapolatedZpos =
        latest.Zpos + next.Zvel * convergence * adjustedLatency;
    const t = Math.min(1, dt / (adjustedLatency * (1 + convergence)));

    const displayOut = {
        Xpos: lastDisplay.Xpos + (extrapolatedXpos - lastDisplay.Xpos) * t,
        Ypos: lastDisplay.Ypos + (extrapolatedYpos - lastDisplay.Ypos) * t,
        Zpos: lastDisplay.Zpos + (extrapolatedZpos - lastDisplay.Zpos) * t,
    };
    return [next, displayOut];
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
