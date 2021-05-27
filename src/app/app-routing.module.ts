import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@app/home/home.component';
import { LoginComponent } from '@app/login/login.component';
import { RolesComponent } from '@app/roles/roles.component';
import { AuthGuard, PermissionEnum } from '@app/auth.guard';
import { UsersComponent } from '@app/users/users.component';
import { NotFoundComponent } from '@app/not-found/not-found.component';
import { UserComponent } from '@app/users/user/user.component';
import { NewUserComponent } from '@app/users/new-user/new-user.component';
import { PatientsComponent } from '@app/patients/patients.component';
import { NewPatientComponent } from './patients/new-patient/new-patient.component';
import { PatientComponent } from './patients/patient/patient.component';
import { ExaminationComponent } from './examinations/examination/examination.component';
import { NewExaminationComponent } from './examinations/new-examination/new-examination.component';
import { NewTherapistExaminationComponent } from './examinations/new-therapist-examination/new-therapist-examination.component';
import { TherapistExaminationComponent } from './examinations/therapist-examination/therapist-examination.component';
import { NewSurgeonExaminationComponent } from './examinations/new-surgeon-examination/new-surgeon-examination.component';
import { SurgeonExaminationComponent } from './examinations/surgeon-examination/surgeon-examination.component';
import { NewOrthopedistExaminationComponent } from './examinations/new-orthopedist-examination/new-orthopedist-examination.component';
import { OrthopedistExaminationComponent } from './examinations/orthopedist-examination/orthopedist-examination.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notfound',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.ROLES_VIEW] },
  },
  {
    path: 'users/new',
    component: NewUserComponent,
    canActivate: [AuthGuard],
    data: {
      permissions: [PermissionEnum.USERS_EDIT, PermissionEnum.ROLES_VIEW],
    },
  },
  {
    path: 'users/:user_id',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.USERS_VIEW] },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.USERS_VIEW] },
  },
  {
    path: 'patients/:patient_id/examinations/general/new',
    component: NewExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.EXAMINATIONS_EDIT] },
  },
  {
    path: 'patients/:patient_id/examinations/general/:examination_id',
    component: ExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.EXAMINATIONS_VIEW] },
  },
  {
    path: 'patients/:patient_id/examinations/therapist/new',
    component: NewTherapistExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.THERAPIST_EXAMINATIONS_EDIT] },
  },
  {
    path: 'patients/:patient_id/examinations/therapist/:examination_id',
    component: TherapistExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.THERAPIST_EXAMINATIONS_VIEW] },
  },
  {
    path: 'patients/:patient_id/examinations/surgeon/new',
    component: NewSurgeonExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.SURGEON_EXAMINATIONS_EDIT] },
  },
  {
    path: 'patients/:patient_id/examinations/surgeon/:examination_id',
    component: SurgeonExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.SURGEON_EXAMINATIONS_VIEW] },
  },
  {
    path: 'patients/:patient_id/examinations/orthopedist/new',
    component: NewOrthopedistExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.ORTHOPEDIST_EXAMINATIONS_EDIT] },
  },
  {
    path: 'patients/:patient_id/examinations/orthopedist/:examination_id',
    component: OrthopedistExaminationComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.ORTHOPEDIST_EXAMINATIONS_VIEW] },
  },
  {
    path: 'patients/new',
    component: NewPatientComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.PATIENTS_EDIT] },
  },
  {
    path: 'patients/:patient_id',
    component: PatientComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.PATIENTS_VIEW] },
  },
  {
    path: 'patients',
    component: PatientsComponent,
    canActivate: [AuthGuard],
    data: { permissions: [PermissionEnum.PATIENTS_VIEW] },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'notfound',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
