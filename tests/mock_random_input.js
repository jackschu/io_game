const updates = require("../client/src/updates_pb");
const Constants = require("../Constants");

module.exports = { createRandomMouse };

function createRandomMouse(userContext, events, done) {
  let message = new updates.Player();
  message.setXpos(Math.random() * Constants.WIDTH);
  message.setYpos(Math.random() * Constants.HEIGHT);

  const data = message.serializeBinary();
  userContext.vars.data = data;
  return done();
}
