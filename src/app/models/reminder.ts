export interface Reminder {
  id: string;
  title: string;
  message: string;
  created: number;
  remindAt: number;
  userId: string;
  emailSent?: boolean;
}
