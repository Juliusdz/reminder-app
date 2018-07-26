import { Component, OnInit, OnDestroy } from '@angular/core';
import { RemindersService } from '../services/reminders.service';
import { Observable, Subscription } from '../../../node_modules/rxjs';
import { Reminder } from '../models/reminder';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'reminders-list',
  templateUrl: './reminders-list.component.html',
  styleUrls: ['./reminders-list.component.css']
})
export class RemindersListComponent implements OnInit, OnDestroy {

  reminders: Observable<Reminder[]>;
  authStatusSub: Subscription;
  userId: string;
  userIsAuthenticated = false;
  isLoading = false;

  constructor( private rs: RemindersService,
            private authService: AuthService) { }

  ngOnInit() {
    this.rs.getReminders();
    this.reminders = this.rs.getReminderUpdateListener();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userIsAuthenticated = this.authService.getIsAuth();
    });
  }

  deleteReminder(id: string) {
    this.rs.deleteReminder(id);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  filterReminders(date: Date) {
    this.rs.filterReminders(date);
  }

  returnNotFilteredReminders() {
    this.rs.returnNotFilteredReminders();
  }

}
