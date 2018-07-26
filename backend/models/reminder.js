const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String },
  created: { type: Number, required: true },
  remindAt: { type: Number, required: true },
  emailSent: { type: Boolean, required: true, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});


module.exports = mongoose.model('Reminder', reminderSchema);
