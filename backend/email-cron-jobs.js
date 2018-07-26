var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

const Reminder = require('./models/reminder');
const User = require('./models/user');

// Reminder.remove({}, function(err) {
//   console.log('Reminder collection removed')
// });

// User.remove({}, function(err) {
//   console.log('User collection removed')
// });

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'remindersaplikacija@gmail.com',
    pass: 'yespassword'
  }
});

var registerCronJobs = function() {
  // Reminder.find().then(console.log)
  Reminder.find({ emailSent: false })
    .then(reminders => {
      let sendMail = createCronJob;
      reminders.map(sendMail);
    })
}

var registerCronJob = createCronJob;

var cancelCronJob = function(id) {
  schedule.scheduledJobs[id].cancel();
}

var replaceCronJob = function(reminder) {
  cancelCronJob(reminder._id + '');
  createCronJob(reminder);
}

function createCronJob(reminder) {
  return User.findOne({_id: reminder.userId}).then(user => {
    if (user) {
      let remindDate = new Date(reminder.remindAt);
      let mailOptions = {
        from: 'remindersaplikacija@gmail.com',
        to: user.email,
        subject: reminder.title,
        text: reminder.message
      };
      schedule.scheduleJob(reminder._id.toString(), remindDate, function(){
        transporter.sendMail(mailOptions, function(err, info){
          if (err) {
            console.log(err);
          } else {
            console.log('Email sent: ' + info.response);
            Reminder.findByIdAndUpdate(reminder.id, { $set: { emailSent: true  }}, { new: true }, function(err, rem) {
              if (err)
                console.log(err)
              console.log('Reminder updated', rem)
            });
          }
        });
      });
    } else { console.log('User not found!') }
  });
}

module.exports = {
  registerCronJobs: registerCronJobs,
  registerCronJob: registerCronJob,
  replaceCronJob: replaceCronJob,
  cancelCronJob: cancelCronJob
};

