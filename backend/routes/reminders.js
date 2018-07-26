const express = require('express');
const router = express.Router();

const Reminder = require('../models/reminder');
const checkAuth = require("../middleware/check-auth");

const emailCronJobs = require("../email-cron-jobs");

//router.all('*', checkAuth);

router.post('', checkAuth, (req, res) => {
  const reminder = new Reminder({
    title: req.body.title,
    message: req.body.message,
    created: req.body.created,
    remindAt: req.body.remindAt,
    userId: req.userData.userId
  });
  reminder.save().then(reminderData => {
    res.status(201).json({
      message: 'Reminder added, great success!',
      id: reminderData._id
    });
    emailCronJobs.registerCronJob(reminder);
  });
})

router.put('/:id', checkAuth, (req, res) => {
  const reminder = new Reminder({
    _id: req.params.id,
    title: req.body.title,
    message: req.body.message,
    created: req.body.created,
    remindAt: req.body.remindAt,
    userId: req.userData.userId
  });
  Reminder.updateOne({_id: req.params.id, userId: req.userData.userId }, reminder).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({message: 'Reminder updated'});
      emailCronJobs.replaceCronJob(reminder);
    } else {
      res.status(401).json({ message: 'Not authorised!'})
    }
  })
});

router.get('', checkAuth, (req, res) => {
  Reminder.find({'userId': req.userData.userId}) // no callback is used as it could become callback hell easily.
    .then(documents => { // returns similar thing to a Promise so can use then()
      res.status(200).json({
        message: 'Reminders fetch successfull',
        reminders: documents
      });
    });
});

router.delete('/:id', checkAuth, (req, res) => {
  Reminder.deleteOne({ _id: req.params.id, userId: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Reminder deleted'});
      emailCronJobs.cancelCronJob(req.params.id + '');
    } else {
      res.status(401).json({ message: 'Not authorised!'})
    }
  })
})

module.exports = router;
