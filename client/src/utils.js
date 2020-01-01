import Constants from '../../Constants.json';

export function pointProject(x, y, z) {
    let x_0 = Constants.WIDTH / 2;
    let y_0 = Constants.HEIGHT / 2;
    let xp = x_0 + ((x - x_0) * Constants.PERSPECTIVE_D) / (z + Constants.PERSPECTIVE_D);
    let yp = y_0 + ((y - y_0) * Constants.PERSPECTIVE_D) / (z + Constants.PERSPECTIVE_D);

    return [xp, yp];
}

export function clip(number, min, max) {
    return Math.max(min, Math.min(number, max));
}
