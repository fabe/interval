// For each of the nights
$(nights).each(function(i) {

  // Get CSS ID and the json url
  var id = 'chart-' + (i+1);
  var url = "accel/" + nights[i]._id;
  
  // Get data of night
  $.getJSON( url, function( data ) {
      // Set up variables
      var finalData = [],
          xAngle = data[0].Ax,
          newData = [];

      // Get all x angles and the margin to the last angle.
      for (var i = 0; i < data.length; i++) {
          var x = xAngle - data[i].Ax;
          newData.push(x);
          xAngle = data[i].Ay;
      }

      // All angles should be positive.
      for (var i = 0; i < newData.length; i++) {
          newData[i] = Math.abs((newData[i] * -1));
      }

      // Smoothen array (needs work)
      var newData = smoothArray(newData, 5);

      // Push final values with timestamp to array
      for (var i = 0; i < newData.length; i++) {
          finalData.push({
              x: newData[i],
              timestamp: data[i].timestamp
          });
      }

      // Draw chart with data
      Morris.Line({
        element: id,
        data: finalData,
        xkey: 'timestamp',
        ykeys: ['x'],

        axes: 'x',
        
        grid: false,
        continuousLine: true,
        resize: true,

        lineColors: ['#fff'],
        pointStrokeColors: ['#000'],
        pointSize: 0,

        gridTextFamily: 'Gotham Rounded, Avenir Next',
        gridTextSize: '14px',
        gridTextColor: '#fff'    
      });
  });

});

$(function() {
  var now = moment();
  var socket = new io();

  // Time calculations
  $('.details .relative').each(function (i, e) {
    var time = moment($(e).parent().attr('from'));
    var diff = now.diff(time, 'days');

    $(e).html(time.format('MMMM Do'));
  });

  // Time calculations
  $('.details .duration').each(function (i, e) {
    var from = moment($(e).parent().attr('from'));
    var to = moment($(e).parent().attr('to'));

    var duration = moment.duration(to.diff(from));
    $(e).html(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
  });

  // Time calculations
  $('.details .times').each(function (i, e) {
    var from = moment($(e).parent().attr('from'));
    var to = moment($(e).parent().attr('to'));

    $(e).html(from.hours() + ":" + from.minutes() + " \u2013 " + to.hours() + ":" + to.minutes());
  });

  // Set up socket.io
  socket.connect('http://localhost:3000', {
    autoConnect: true
  });

  // Find our if tracking already started and change button accordingly
  if(trigger == -1) {
    var started = true;
    $('.control').html('Stop Tracking');
  } else {
    var started = false;
  }

  // Start/Stop tracking
  $('.control').click(function() {
      started = !started;

      if(started) {
          $(this).html('Stop Tracking');
          socket.send(1);
      } else {
          $(this).html('Start Tracking');
          socket.send(0);
      }
  });

});

// Smoothen array function
function smoothArray(array, smoothing) {
    var newArray = [];
    for (i = 0; i < array.length; i++) {
        var sum = 0;

        for (index = i - smoothing; index <= i + smoothing; index++) {
            var thisIndex = index < 0 ? index + array.length : index % array.length;
            sum += array[thisIndex];
        }
        newArray[i] = sum / ((smoothing * 2) + 1);
    }

    return newArray;
}
