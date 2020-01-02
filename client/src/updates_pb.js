// source: updates.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.Ball', null, global);
goog.exportSymbol('proto.GameStart', null, global);
goog.exportSymbol('proto.GameStart.Wall', null, global);
goog.exportSymbol('proto.GameState', null, global);
goog.exportSymbol('proto.Player', null, global);
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
  /**
   * @public
   * @override
   */
  proto.GameState.displayName = 'proto.GameState';
}
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
  /**
   * @public
   * @override
   */
  proto.Player.displayName = 'proto.Player';
}
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
  /**
   * @public
   * @override
   */
  proto.Ball.displayName = 'proto.Ball';
}
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
  /**
   * @public
   * @override
   */
  proto.GameStart.displayName = 'proto.GameStart';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GameState.prototype.toObject = function(opt_includeInstance) {
  return proto.GameState.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GameState} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GameState.toObject = function(includeInstance, msg) {
  var f, obj = {
    ball: (f = msg.getBall()) && proto.Ball.toObject(includeInstance, f),
    playersMap: (f = msg.getPlayersMap()) ? f.toObject(includeInstance, proto.Player.toObject) : [],
    timestamp: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.Player.deserializeBinaryFromReader, 0);
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GameState.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.GameState.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.GameState} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GameState.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBall();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Ball.serializeBinaryToWriter
    );
  }
  f = message.getPlayersMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.Player.serializeBinaryToWriter);
  }
  f = message.getTimestamp();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional Ball ball = 1;
 * @return {?proto.Ball}
 */
proto.GameState.prototype.getBall = function() {
  return /** @type{?proto.Ball} */ (
    jspb.Message.getWrapperField(this, proto.Ball, 1));
};


/** @param {?proto.Ball|undefined} value */
proto.GameState.prototype.setBall = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 */
proto.GameState.prototype.clearBall = function() {
  this.setBall(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
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
 * Clears values from the map. The map will be non-null.
 */
proto.GameState.prototype.clearPlayersMap = function() {
  this.getPlayersMap().clear();
};


/**
 * optional uint64 timestamp = 3;
 * @return {number}
 */
proto.GameState.prototype.getTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.GameState.prototype.setTimestamp = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Player.prototype.toObject = function(opt_includeInstance) {
  return proto.Player.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Player} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Player.toObject = function(includeInstance, msg) {
  var f, obj = {
    xpos: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    ypos: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    xlast: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    ylast: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0)
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Player.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Player.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Player} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Player.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getXpos();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getYpos();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getXlast();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getYlast();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
};


/**
 * optional float Xpos = 1;
 * @return {number}
 */
proto.Player.prototype.getXpos = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.Player.prototype.setXpos = function(value) {
  jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional float Ypos = 2;
 * @return {number}
 */
proto.Player.prototype.getYpos = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/** @param {number} value */
proto.Player.prototype.setYpos = function(value) {
  jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional float Xlast = 3;
 * @return {number}
 */
proto.Player.prototype.getXlast = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/** @param {number} value */
proto.Player.prototype.setXlast = function(value) {
  jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float Ylast = 4;
 * @return {number}
 */
proto.Player.prototype.getYlast = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/** @param {number} value */
proto.Player.prototype.setYlast = function(value) {
  jspb.Message.setProto3FloatField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Ball.prototype.toObject = function(opt_includeInstance) {
  return proto.Ball.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Ball} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Ball.toObject = function(includeInstance, msg) {
  var f, obj = {
    xpos: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    ypos: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    zpos: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    xvel: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0),
    yvel: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
    zvel: jspb.Message.getFloatingPointFieldWithDefault(msg, 6, 0.0),
    xang: jspb.Message.getFloatingPointFieldWithDefault(msg, 7, 0.0),
    yang: jspb.Message.getFloatingPointFieldWithDefault(msg, 8, 0.0),
    zang: jspb.Message.getFloatingPointFieldWithDefault(msg, 9, 0.0)
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Ball.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Ball.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Ball} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Ball.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getXpos();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getYpos();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getZpos();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getXvel();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = message.getYvel();
  if (f !== 0.0) {
    writer.writeFloat(
      5,
      f
    );
  }
  f = message.getZvel();
  if (f !== 0.0) {
    writer.writeFloat(
      6,
      f
    );
  }
  f = message.getXang();
  if (f !== 0.0) {
    writer.writeFloat(
      7,
      f
    );
  }
  f = message.getYang();
  if (f !== 0.0) {
    writer.writeFloat(
      8,
      f
    );
  }
  f = message.getZang();
  if (f !== 0.0) {
    writer.writeFloat(
      9,
      f
    );
  }
};


/**
 * optional float Xpos = 1;
 * @return {number}
 */
proto.Ball.prototype.getXpos = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setXpos = function(value) {
  jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional float Ypos = 2;
 * @return {number}
 */
proto.Ball.prototype.getYpos = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setYpos = function(value) {
  jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional float Zpos = 3;
 * @return {number}
 */
proto.Ball.prototype.getZpos = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setZpos = function(value) {
  jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float Xvel = 4;
 * @return {number}
 */
proto.Ball.prototype.getXvel = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setXvel = function(value) {
  jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional float Yvel = 5;
 * @return {number}
 */
proto.Ball.prototype.getYvel = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setYvel = function(value) {
  jspb.Message.setProto3FloatField(this, 5, value);
};


/**
 * optional float Zvel = 6;
 * @return {number}
 */
proto.Ball.prototype.getZvel = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 6, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setZvel = function(value) {
  jspb.Message.setProto3FloatField(this, 6, value);
};


/**
 * optional float Xang = 7;
 * @return {number}
 */
proto.Ball.prototype.getXang = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 7, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setXang = function(value) {
  jspb.Message.setProto3FloatField(this, 7, value);
};


/**
 * optional float Yang = 8;
 * @return {number}
 */
proto.Ball.prototype.getYang = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 8, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setYang = function(value) {
  jspb.Message.setProto3FloatField(this, 8, value);
};


/**
 * optional float Zang = 9;
 * @return {number}
 */
proto.Ball.prototype.getZang = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 9, 0.0));
};


/** @param {number} value */
proto.Ball.prototype.setZang = function(value) {
  jspb.Message.setProto3FloatField(this, 9, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GameStart.prototype.toObject = function(opt_includeInstance) {
  return proto.GameStart.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GameStart} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GameStart.toObject = function(includeInstance, msg) {
  var f, obj = {
    yourid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    wall: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
      var value = /** @type {!proto.GameStart.Wall} */ (reader.readEnum());
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GameStart.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.GameStart.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.GameStart} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GameStart.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getYourid();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getWall();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.GameStart.Wall = {
  FRONT: 0,
  BACK: 1
};

/**
 * optional uint32 YourID = 1;
 * @return {number}
 */
proto.GameStart.prototype.getYourid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.GameStart.prototype.setYourid = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional Wall wall = 2;
 * @return {!proto.GameStart.Wall}
 */
proto.GameStart.prototype.getWall = function() {
  return /** @type {!proto.GameStart.Wall} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {!proto.GameStart.Wall} value */
proto.GameStart.prototype.setWall = function(value) {
  jspb.Message.setProto3EnumField(this, 2, value);
};


goog.object.extend(exports, proto);
