import { Component, OnInit } from '@angular/core';
import { RemindersService } from '../services/reminders.service';
import { FormGroup, FormControlName, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Reminder } from '../models/reminder';

@Component({
  selector: 'reminder-detail',
  templateUrl: './reminder-detail.component.html',
  styleUrls: ['./reminder-detail.component.css']
})
export class ReminderDetailComponent implements OnInit {

  form: FormGroup;
  title: FormControlName;
  message: FormControlName;
  mode = 'Create';
  isLoading = false;
  reminderId: string;
  reminder: Reminder;

  constructor(
              private rs: RemindersService,
              private fb: FormBuilder,
              public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: new FormControl(),
      message: new FormControl(),
      remindAt: new FormControl()
    });

    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = false;
      if (paramMap.has('reminderId')) {
        this.mode = 'Edit';
        this.reminderId = paramMap.get('reminderId');
        this.reminder = this.rs.getReminder(this.reminderId);
        this.form.patchValue({
          title: this.reminder.title,
          message: this.reminder.message,
          created: new Date().getTime(),
          remindAt: new Date(this.reminder.remindAt)
        });
      } else {
        this.mode = 'Create';
        this.reminderId = null;
      }
    });

  }

  saveReminder(form) {
    if (!this.form.valid) {
      return;
    } else {
      this.isLoading = true;
      if (this.mode === 'Create') {
        this.rs.addReminder(form.title, form.message, form.remindAt.getTime());
      } else if (this.mode === 'Edit') {
        this.rs.updateReminder(this.reminderId, form.title, form.message, form.remindAt.getTime());
      }
    }
    this.form.reset();
  }

}
