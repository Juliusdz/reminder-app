import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Reminder } from '../models/reminder';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiURL + '/reminders/';

@Injectable({
  providedIn: 'root',
})
export class RemindersService {
  private reminders: Reminder[] = [];
  private remindersUpdated = new Subject<Reminder[]>();

  constructor(private http: HttpClient,
            private router: Router) {}

  getReminders() {
    this.http.get<{message: string, reminders: any}>(BACKEND_URL)
      .pipe(map((reminderData) => {
        return reminderData.reminders.map(reminder => {
          return {
            title: reminder.title,
            message: reminder.message,
            id: reminder._id,
            remindAt: reminder.remindAt,
            userId: reminder.userId,
            emailSent: reminder.emailSent
          };
        });
      }))
      .subscribe(reminders => {
        this.reminders = reminders;
        this.remindersUpdated.next([...this.reminders]);
      });
  }

  getReminderUpdateListener() {
    return this.remindersUpdated.asObservable();
  }

  filterReminders(date: Date) {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const reminders = this.reminders.filter((reminder: Reminder) => {
      const remindAtDate = new Date(reminder.remindAt);
      if (remindAtDate.getFullYear() === year &&
          remindAtDate.getMonth() === month &&
          remindAtDate.getDate() === day) {
            return true;
          } else { return false; }
    });
    this.remindersUpdated.next([...reminders]);
  }

  returnNotFilteredReminders() {
    this.remindersUpdated.next([...this.reminders]);
  }

  getReminder(id: string) {
    return {...this.reminders.find( r => r.id === id) };
  }

  addReminder(title: string, message: string, remindAt: number) {
    const reminder: Reminder = {id: null, title: title,
                                message: message, remindAt:
                                remindAt, userId: null, created: new Date().getTime() };
    this.http.post<{message: string, id: string}>(BACKEND_URL, reminder)
      .subscribe(res => {
        reminder.id = res.id;
        this.reminders.push(reminder);
        this.remindersUpdated.next([...this.reminders]);
        this.router.navigate(['/']);
      });
  }

  updateReminder(id: string, title: string, message: string, remindAt: number) {
    const reminder: Reminder = {id: id, title: title,
                                message: message, remindAt:
                                remindAt, userId: null, created: new Date().getTime() };
    this.http.put<{message: string}>(BACKEND_URL + id, reminder)
      .subscribe(() => {
        const updateReminders = [...this.reminders];
        const index = updateReminders.findIndex( r => r.id === id);
        updateReminders[index] = reminder;
        this.reminders = updateReminders;
        this.remindersUpdated.next([...this.reminders]);
        this.router.navigate(['/']);
      });
  }

  deleteReminder(id: string) {
    this.http.delete<{message: string}>(BACKEND_URL + id)
      .subscribe(() => {
        this.reminders = this.reminders.filter(r => r.id !== id);
        this.remindersUpdated.next([...this.reminders]);
      });
  }
}
