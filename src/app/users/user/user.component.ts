import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthenticationService, TokenUser } from '@services/authentication.service';
import { PermissionEnum } from '@app/auth.guard';
import { User } from '@services/user.service';

export interface EditedUser extends User{
  password?: string
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  @Input() user?: User;
  oldUser?: User;
  password: string = "";

  @Output() editedUser = new EventEmitter<EditedUser>();
  @Output() deletedUser = new EventEmitter<User>();

  private tokenUser?: TokenUser;
  private tokenUserSubscription?: Subscription;

  error: string = "";

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.tokenUserSubscription = this.authService.user.subscribe(u => {this.tokenUser=u});
    if (this.user) {
      this.oldUser = {...this.user}
    }
  }

  ngOnDestroy(): void {
    if (this.tokenUserSubscription) {
      this.tokenUserSubscription.unsubscribe();
    }
  }

  get canAdd() {
    return this.tokenUser?.permissions.includes(PermissionEnum.USERS_ADD);
  }

  get canEdit() {
    return this.tokenUser?.permissions.includes(PermissionEnum.USERS_EDIT);
  }

  dropForm() {
    Object.assign(this.user, this.oldUser);
    this.error = "";
    this.password = "";
  }

  save() {
    if (this.user) {
      this.editedUser.emit({
        ...this.user,
        password: this.password.length > 0 ? this.password : undefined
      })
    }
  }

  delete() {
    if (this.user) {
      this.deletedUser.emit(this.user)
    }
  }
}
