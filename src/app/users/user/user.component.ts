import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthenticationService, TokenUser } from '@services/authentication.service';
import { PermissionEnum } from '@app/auth.guard';
import { User } from '@services/user.service';
import { Role } from '@app/services/roles.service';

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
  @Input() passwordRequired?: boolean;
  @Input() roles?: Role[];
  selectedRole?: string;

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
      this.oldUser = {...this.user};
      this.selectedRole = this.user.role.code;
    }
  }

  ngOnDestroy(): void {
    if (this.tokenUserSubscription) {
      this.tokenUserSubscription.unsubscribe();
    }
  }

  get canEdit() {
    return this.tokenUser?.permissions.includes(PermissionEnum.USERS_EDIT);
  }

  dropForm() {
    Object.assign(this.user, this.oldUser);
    if (this.user) {
      this.selectedRole = this.user.role.code;
    }
    this.error = "";
    this.password = "";
  }

  save() {
    if (this.roles && this.selectedRole) {
      let role = this.roles.find(r => { return r.code == this.selectedRole });
      if (this.user && role) {
        this.editedUser.emit({
          ...this.user,
          role: role,
          password: this.password.length > 0 ? this.password : undefined
        });
      }
    }
  }

  delete() {
    if (this.user) {
      this.deletedUser.emit(this.user)
    }
  }
}
