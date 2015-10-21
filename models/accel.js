var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accelSchema = new Schema({
    nightId: Schema.ObjectId,
    timestamp: String,
    aX: Number,
    aY: Number,
    aZ: Number,
    gX: Number,
    gY: Number,
    gZ: Number,
    Ax: Number,
    Ay: Number
}, {
    versionKey: false
});

mongoose.model('accel', accelSchema, 'accel');