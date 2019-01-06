import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { Barometer } from "barometer";
import { HeartRateSensor } from "heart-rate";

// Update the clock every minute
clock.granularity = "seconds";

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

let altitude = document.getElementById("altitude");
let hr = document.getElementById("hr");
var barom = new Barometer();
var heart = new HeartRateSensor();

var units = "m";

function altitudeFromPressure(pressure, units="ft") {
  if (units === "ft" ) {
    return (1 - (pressure/1013.25)**0.190284)*145366.45;
  } else {
    return (1 - (pressure/1013.25)**0.190284)*44307.69396;
  }
}

barom.onreading = () => {
  altitude.text = "Altitude: " + altitudeFromPressure(barom.pressure / 100, units) + " " + units +".";
}

heart.onreading = function() {
  hr.text = "Heart Rate: " + heart.heartRate;
}
// Begin monitoring the sensors
barom.start();
heart.start();

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
}

// Update the clock every tick event
clock.ontick = () => updateClock();
