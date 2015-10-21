/* REQUIRES/GLOBALS
========================================================================== */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    cron = require('cron'),
    mpu6050 = require('mpu6050'),
    mpu = new mpu6050(),
    io = require('socket.io'),
    fs = require('fs'),
    jade = require('jade'),
    socket = io.listen(server),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    trigger = 0,
    accelValues = [],
    port = 80;



/* EXPRESS
========================================================================== */
app.use('/', express.static(__dirname + '/public'));
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}



/* JADE
========================================================================== */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



/* MONGOOSE/DATABASE
========================================================================== */
mongoose.connect('mongodb://127.0.0.1:27017/nights');

// Require all mongoose models
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename)
});

// Declare mongoose collections
var Details = mongoose.model('details');
var Accel = mongoose.model('accel');

mpu.initialize();



/* CONTROLS
========================================================================== */
// Start/End tracking via socket msg.
socket.on('connection', function(client) {
    client.on('message', function(message) {
        if (mpu.testConnection()) {
            if(message == 1) {
                mpu.setSleepEnabled(0);
                trigger = -1;
                startNight();
            } else if(message == 0) {
                mpu.setSleepEnabled(1);
                trigger = 0;
                endNight();
            }
        }
    });
});



/* CRONJOBS
========================================================================== */
var everySecond = cron.job("* * * * * *", function(){
    var accel = mpu.getMotion6();
    accelValues.push({
        aX: accel[0],
        aY: accel[1],
        aZ: accel[2],
        gX: accel[3],
        gY: accel[4],
        gZ: accel[5]
    });
});

var everyMinute = cron.job("0 * * * * *", function(){
    var aX = average(accelValues, "aX");
    var aY = average(accelValues, "aY");
    var aZ = average(accelValues, "aZ");
    var gX = average(accelValues, "gX");
    var gY = average(accelValues, "gY");
    var gZ = average(accelValues, "gZ");
    var Ax = angles("x", [aX, aY, aZ]);
    var Ay = angles("y", [aX, aY, aZ]);

    accelValues = [];
    saveAccel(aX, aY, aZ, gX, gY, gZ, Ax, Ay);
});



/* FUNCTIONS
========================================================================== */
// Save one accelerometer value.
function saveAccel(aX, aY, aZ, gX, gY, gZ, Ax, Ay) {
    Details.find(function(err, data) {
        if (err) throw err;
        var nightId = data[0]._id;

        var motion = new Accel({
            nightId: nightId,
            timestamp: new Date().toISOString(),
            aX: aX,
            aY: aY,
            aZ: aZ,
            gX: gX,
            gY: gY,
            gZ: gZ,
            Ax: Ax,
            Ay: Ay
        });

        console.log(motion);
        motion.save(function(err) {
            if (err) {
                mpu.setSleepEnabled(1);
                mpu.setSleepEnabled(0);
                mpu.initialize();
                console.log(err);
            } else {
                console.log('Accelerometer values saved!');
            }
        });
    }).sort([['start', 'descending']]).limit(1); 
};

// Calculate angle from x, y and z.
function angles(layer, data) {
    var x, y, z, rads;

    x = data[0] / 16384;
    y = data[1] / 16384;
    z = data[2] / 16384;

    if(layer == "y") {
      rads = Math.atan2(y, Math.hypot(x, z));
    } else {
      rads = Math.atan2(x, Math.hypot(y, z));
    }

    var angle = rads * (180 / Math.PI);
    return angle.toPrecision(6);
};

// Start night/tracking.
function startNight() {
    var night = new Details({
        start: new Date().toISOString(),
        end: new Date().toISOString()
    });

    night.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Night started.');
        }
        
    });

    everySecond.start();
    everyMinute.start();
};

// End night/tracking.
function endNight() {
    Details.find(function(err, data) {
        if(err) throw err;
        var nightId = data[0]._id;
        Details.findOneAndUpdate({_id: nightId}, { end: new Date().toISOString() }, {}, function(err) {
            if(err) throw err;
        });
    }).sort([['start', 'descending']]).limit(1); 
    
    everySecond.stop();
    everyMinute.stop();

    console.log('Night ended.');
}

// Get average number (object, key as string [e.g. "x", "y"])
function average(obj, key) {
    var sum = 0;
    for(var i = 0; i < obj.length; i++){
        sum += obj[i][key];
    }

    var avg = sum/obj.length;
    return avg.toPrecision(6);
}



/* API
========================================================================== */
// Set up root route
app.get('/', function (req, res) {
    Details.find(function(err, data) {
        res.render('index', { nights: data, trigger: trigger });
    }).sort([['start', 'descending']]).limit(3); 
});

// Set up /details API
app.get('/details', function (req, res) {
    Details.find(function(err, details) {
        if(err) throw err;
        res.send(details);
    })
});

// Set up /accel API
app.get('/accel/:nightId', function (req, res) {
    Accel.find({nightId: req.params.nightId}, function(err, accel) {
        res.send(accel);
    })
});



/* RUN SERVER
========================================================================== */
console.log('Listening on port http://localhost:' + port);
server.listen(port, '0.0.0.0');