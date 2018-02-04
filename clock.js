var CronJob = require('cron').CronJob;
var retry = require('async/retry');
var register = require('./index.js');

var job = new CronJob({
  cronTime: "00 9,21 * * *", // everyday, 9:00am, 9:00pm
  onTick: register.run,
  start: true,
  timeZone: "America/Chicago"
});

job.start();