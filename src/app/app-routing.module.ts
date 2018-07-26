import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { RemindersListComponent } from './reminders-list/reminders-list.component';
import { ReminderDetailComponent } from './reminder-detail/reminder-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Route[] = [
  { path: '', component: RemindersListComponent },
  { path: 'create', component: ReminderDetailComponent, canActivate: [AuthGuard] },
  { path: 'edit/:reminderId', component: ReminderDetailComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
