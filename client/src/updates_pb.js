/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.AnyMessage', null, global);
goog.exportSymbol('proto.Ball', null, global);
goog.exportSymbol('proto.GameStart', null, global);
goog.exportSymbol('proto.GameState', null, global);
goog.exportSymbol('proto.Player', null, global);
goog.exportSymbol('proto.PlayerJoin', null, global);
goog.exportSymbol('proto.Wall', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.AnyMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.AnyMessage.oneofGroups_);
};
goog.inherits(proto.AnyMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.AnyMessage.displayName = 'proto.AnyMessage';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.AnyMessage.oneofGroups_ = [[1,2,3]];

/**
 * @enum {number}
 */
proto.AnyMessage.DataCase = {
  DATA_NOT_SET: 0,
  STATE: 1,
  START: 2,
  JOIN: 3
};

/**
 * @return {proto.AnyMessage.DataCase}
 */
proto.AnyMessage.prototype.getDataCase = function() {
  return /** @type {proto.AnyMessage.DataCase} */(jspb.Message.computeOneofCase(this, proto.AnyMessage.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.AnyMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.AnyMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.AnyMessage} msg The msg instance to transform.
 * @return {!Object}
 */
proto.AnyMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    state: (f = msg.getState()) && proto.GameState.toObject(includeInstance, f),
    start: (f = msg.getStart()) && proto.GameStart.toObject(includeInstance, f),
    join: (f = msg.getJoin()) && proto.PlayerJoin.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.AnyMessage}
 */
proto.AnyMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.AnyMessage;
  return proto.AnyMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.AnyMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.AnyMessage}
 */
proto.AnyMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.GameState;
      reader.readMessage(value,proto.GameState.deserializeBinaryFromReader);
      msg.setState(value);
      break;
    case 2:
      var value = new proto.GameStart;
      reader.readMessage(value,proto.GameStart.deserializeBinaryFromReader);
      msg.setStart(value);
      break;
    case 3:
      var value = new proto.PlayerJoin;
      reader.readMessage(value,proto.PlayerJoin.deserializeBinaryFromReader);
      msg.setJoin(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.AnyMessage} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.AnyMessage.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.AnyMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.AnyMessage.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getState();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.GameState.serializeBinaryToWriter
    );
  }
  f = this.getStart();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.GameStart.serializeBinaryToWriter
    );
  }
  f = this.getJoin();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.PlayerJoin.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.AnyMessage} The clone.
 */
proto.AnyMessage.prototype.cloneMessage = function() {
  return /** @type {!proto.AnyMessage} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional GameState state = 1;
 * @return {proto.GameState}
 */
proto.AnyMessage.prototype.getState = function() {
  return /** @type{proto.GameState} */ (
    jspb.Message.getWrapperField(this, proto.GameState, 1));
};


/** @param {proto.GameState|undefined} value  */
proto.AnyMessage.prototype.setState = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.AnyMessage.oneofGroups_[0], value);
};


proto.AnyMessage.prototype.clearState = function() {
  this.setState(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.AnyMessage.prototype.hasState = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional GameStart start = 2;
 * @return {proto.GameStart}
 */
proto.AnyMessage.prototype.getStart = function() {
  return /** @type{proto.GameStart} */ (
    jspb.Message.getWrapperField(this, proto.GameStart, 2));
};


/** @param {proto.GameStart|undefined} value  */
proto.AnyMessage.prototype.setStart = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.AnyMessage.oneofGroups_[0], value);
};


proto.AnyMessage.prototype.clearStart = function() {
  this.setStart(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.AnyMessage.prototype.hasStart = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional PlayerJoin join = 3;
 * @return {proto.PlayerJoin}
 */
proto.AnyMessage.prototype.getJoin = function() {
  return /** @type{proto.PlayerJoin} */ (
    jspb.Message.getWrapperField(this, proto.PlayerJoin, 3));
};


/** @param {proto.PlayerJoin|undefined} value  */
proto.AnyMessage.prototype.setJoin = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.AnyMessage.oneofGroups_[0], value);
};


proto.AnyMessage.prototype.clearJoin = function() {
  this.setJoin(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.AnyMessage.prototype.hasJoin = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.GameState = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.GameState, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.GameState.displayName = 'proto.GameState';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GameState.prototype.toObject = function(opt_includeInstance) {
  return proto.GameState.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GameState} msg The msg instance to transform.
 * @return {!Object}
 */
proto.GameState.toObject = function(includeInstance, msg) {
  var f, obj = {
    ball: (f = msg.getBall()) && proto.Ball.toObject(includeInstance, f),
    playersMap: (f = msg.getPlayersMap(true)) ? f.toArray() : [],
    timestamp: msg.getTimestamp()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.GameState}
 */
proto.GameState.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.GameState;
  return proto.GameState.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.GameState} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.GameState}
 */
proto.GameState.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Ball;
      reader.readMessage(value,proto.Ball.deserializeBinaryFromReader);
      msg.setBall(value);
      break;
    case 2:
      var value = msg.getPlayersMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.Player.deserializeBinaryFromReader);
         });
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTimestamp(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.GameState} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.GameState.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GameState.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.GameState.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getBall();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Ball.serializeBinaryToWriter
    );
  }
  f = this.getPlayersMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.Player.serializeBinaryToWriter);
  }
  f = this.getTimestamp();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.GameState} The clone.
 */
proto.GameState.prototype.cloneMessage = function() {
  return /** @type {!proto.GameState} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional Ball ball = 1;
 * @return {proto.Ball}
 */
proto.GameState.prototype.getBall = function() {
  return /** @type{proto.Ball} */ (
    jspb.Message.getWrapperField(this, proto.Ball, 1));
};


/** @param {proto.Ball|undefined} value  */
proto.GameState.prototype.setBall = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.GameState.prototype.clearBall = function() {
  this.setBall(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.GameState.prototype.hasBall = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * map<uint32, Player> players = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.Player>}
 */
proto.GameState.prototype.getPlayersMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,!proto.Player>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.Player));
};


/**
 * optional uint64 timestamp = 3;
 * @return {number}
 */
proto.GameState.prototype.getTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.GameState.prototype.setTimestamp = function(value) {
  jspb.Message.setField(this, 3, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Player = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Player, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Player.displayName = 'proto.Player';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Player.prototype.toObject = function(opt_includeInstance) {
  return proto.Player.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Player} msg The msg instance to transform.
 * @return {!Object}
 */
proto.Player.toObject = function(includeInstance, msg) {
  var f, obj = {
    xpos: msg.getXpos(),
    ypos: msg.getYpos(),
    xlast: msg.getXlast(),
    ylast: msg.getYlast()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Player}
 */
proto.Player.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Player;
  return proto.Player.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Player} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Player}
 */
proto.Player.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setXpos(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setYpos(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setXlast(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setYlast(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.Player} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.Player.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Player.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.Player.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getXpos();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = this.getYpos();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = this.getXlast();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = this.getYlast();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.Player} The clone.
 */
proto.Player.prototype.cloneMessage = function() {
  return /** @type {!proto.Player} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional float Xpos = 1;
 * @return {number}
 */
proto.Player.prototype.getXpos = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.Player.prototype.setXpos = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional float Ypos = 2;
 * @return {number}
 */
proto.Player.prototype.getYpos = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.Player.prototype.setYpos = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional float Xlast = 3;
 * @return {number}
 */
proto.Player.prototype.getXlast = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.Player.prototype.setXlast = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional float Ylast = 4;
 * @return {number}
 */
proto.Player.prototype.getYlast = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.Player.prototype.setYlast = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Ball = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Ball, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Ball.displayName = 'proto.Ball';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Ball.prototype.toObject = function(opt_includeInstance) {
  return proto.Ball.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Ball} msg The msg instance to transform.
 * @return {!Object}
 */
proto.Ball.toObject = function(includeInstance, msg) {
  var f, obj = {
    xpos: msg.getXpos(),
    ypos: msg.getYpos(),
    zpos: msg.getZpos(),
    xvel: msg.getXvel(),
    yvel: msg.getYvel(),
    zvel: msg.getZvel(),
    xang: msg.getXang(),
    yang: msg.getYang(),
    zang: msg.getZang()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Ball}
 */
proto.Ball.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Ball;
  return proto.Ball.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Ball} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Ball}
 */
proto.Ball.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setXpos(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setYpos(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setZpos(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setXvel(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setYvel(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setZvel(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setXang(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setYang(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setZang(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.Ball} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.Ball.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Ball.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.Ball.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getXpos();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = this.getYpos();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = this.getZpos();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = this.getXvel();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = this.getYvel();
  if (f !== 0.0) {
    writer.writeFloat(
      5,
      f
    );
  }
  f = this.getZvel();
  if (f !== 0.0) {
    writer.writeFloat(
      6,
      f
    );
  }
  f = this.getXang();
  if (f !== 0.0) {
    writer.writeFloat(
      7,
      f
    );
  }
  f = this.getYang();
  if (f !== 0.0) {
    writer.writeFloat(
      8,
      f
    );
  }
  f = this.getZang();
  if (f !== 0.0) {
    writer.writeFloat(
      9,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.Ball} The clone.
 */
proto.Ball.prototype.cloneMessage = function() {
  return /** @type {!proto.Ball} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional float Xpos = 1;
 * @return {number}
 */
proto.Ball.prototype.getXpos = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setXpos = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional float Ypos = 2;
 * @return {number}
 */
proto.Ball.prototype.getYpos = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setYpos = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional float Zpos = 3;
 * @return {number}
 */
proto.Ball.prototype.getZpos = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setZpos = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional float Xvel = 4;
 * @return {number}
 */
proto.Ball.prototype.getXvel = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setXvel = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional float Yvel = 5;
 * @return {number}
 */
proto.Ball.prototype.getYvel = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setYvel = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional float Zvel = 6;
 * @return {number}
 */
proto.Ball.prototype.getZvel = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setZvel = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional float Xang = 7;
 * @return {number}
 */
proto.Ball.prototype.getXang = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setXang = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional float Yang = 8;
 * @return {number}
 */
proto.Ball.prototype.getYang = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 8, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setYang = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional float Zang = 9;
 * @return {number}
 */
proto.Ball.prototype.getZang = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 9, 0));
};


/** @param {number} value  */
proto.Ball.prototype.setZang = function(value) {
  jspb.Message.setField(this, 9, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.GameStart = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.GameStart, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.GameStart.displayName = 'proto.GameStart';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GameStart.prototype.toObject = function(opt_includeInstance) {
  return proto.GameStart.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GameStart} msg The msg instance to transform.
 * @return {!Object}
 */
proto.GameStart.toObject = function(includeInstance, msg) {
  var f, obj = {
    yourid: msg.getYourid(),
    wall: msg.getWall()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.GameStart}
 */
proto.GameStart.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.GameStart;
  return proto.GameStart.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.GameStart} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.GameStart}
 */
proto.GameStart.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setYourid(value);
      break;
    case 2:
      var value = /** @type {!proto.Wall} */ (reader.readEnum());
      msg.setWall(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.GameStart} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.GameStart.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GameStart.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.GameStart.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getYourid();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = this.getWall();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.GameStart} The clone.
 */
proto.GameStart.prototype.cloneMessage = function() {
  return /** @type {!proto.GameStart} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint32 YourID = 1;
 * @return {number}
 */
proto.GameStart.prototype.getYourid = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.GameStart.prototype.setYourid = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional Wall wall = 2;
 * @return {!proto.Wall}
 */
proto.GameStart.prototype.getWall = function() {
  return /** @type {!proto.Wall} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {!proto.Wall} value  */
proto.GameStart.prototype.setWall = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PlayerJoin = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.PlayerJoin, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.PlayerJoin.displayName = 'proto.PlayerJoin';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PlayerJoin.prototype.toObject = function(opt_includeInstance) {
  return proto.PlayerJoin.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PlayerJoin} msg The msg instance to transform.
 * @return {!Object}
 */
proto.PlayerJoin.toObject = function(includeInstance, msg) {
  var f, obj = {
    playerwallsMap: (f = msg.getPlayerwallsMap(true)) ? f.toArray() : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PlayerJoin}
 */
proto.PlayerJoin.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PlayerJoin;
  return proto.PlayerJoin.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PlayerJoin} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PlayerJoin}
 */
proto.PlayerJoin.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getPlayerwallsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readEnum);
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.PlayerJoin} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.PlayerJoin.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PlayerJoin.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.PlayerJoin.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPlayerwallsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeEnum);
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.PlayerJoin} The clone.
 */
proto.PlayerJoin.prototype.cloneMessage = function() {
  return /** @type {!proto.PlayerJoin} */ (jspb.Message.cloneMessage(this));
};


/**
 * map<uint32, Wall> playerWalls = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.Wall>}
 */
proto.PlayerJoin.prototype.getPlayerwallsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,!proto.Wall>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      null));
};


/**
 * @enum {number}
 */
proto.Wall = {
  FRONT: 0,
  BACK: 1
};

goog.object.extend(exports, proto);
