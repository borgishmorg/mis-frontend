import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private snackBar: MatSnackBar) {}

  error(message: string) {
    this.snackBar.open(message, undefined, {
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      duration: 2000,
      panelClass: ['error-snackbar'],
    });
  }
}
