import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Material
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateModule,
} from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';
//App
import { AppRoutingModule } from './app-routing.module';
import { ErrorInterceptor } from './error.interceptor';
import { JwtInterceptor } from './jwt.interceptor';
// App components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RolesComponent } from './roles/roles.component';
import { RoleComponent } from './roles/role/role.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { LoadingComponent } from './loading/loading.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientComponent } from './patients/patient/patient.component';
import { NewPatientComponent } from './patients/new-patient/new-patient.component';
import { ExaminationsComponent } from './examinations/examinations.component';
import { getRussianPaginatorIntl } from './russian-paginator-intl';
import * as moment from 'moment';
import { ExaminationComponent } from './examinations/examination/examination.component';
import { NewExaminationComponent } from './examinations/new-examination/new-examination.component';
import { TherapistExaminationComponent } from './examinations/therapist-examination/therapist-examination.component';
import { NewTherapistExaminationComponent } from './examinations/new-therapist-examination/new-therapist-examination.component';
import { SurgeonExaminationComponent } from './examinations/surgeon-examination/surgeon-examination.component';
import { NewSurgeonExaminationComponent } from './examinations/new-surgeon-examination/new-surgeon-examination.component';
import { OrthopedistExaminationComponent } from './examinations/orthopedist-examination/orthopedist-examination.component';
import { NewOrthopedistExaminationComponent } from './examinations/new-orthopedist-examination/new-orthopedist-examination.component';
import { jsPDF } from 'jspdf';
import { font_normal } from '@app/fonts/OpenSans-normal';
import { font_bold } from '@app/fonts/OpenSans-bold';
import { font_italic } from '@app/fonts/OpenSans-italic';
import { font_bolditalic } from '@app/fonts/OpenSans-bolditalic';

jsPDF.API.events.push([
  'addFonts',
  function (this: jsPDF) {
    this.addFileToVFS('OpenSans-normal.ttf', font_normal);
    this.addFileToVFS('OpenSans-bold.ttf', font_bold);
    this.addFileToVFS('OpenSans-italic.ttf', font_italic);
    this.addFileToVFS('OpenSans-bolditalic.ttf', font_bolditalic);
    this.addFont('OpenSans-normal.ttf', 'OpenSans', 'normal');
    this.addFont('OpenSans-bold.ttf', 'OpenSans', 'bold');
    this.addFont('OpenSans-italic.ttf', 'OpenSans', 'italic');
    this.addFont('OpenSans-bolditalic.ttf', 'OpenSans', 'bolditalic');
  },
]);

moment.locale('ru');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RolesComponent,
    RoleComponent,
    UsersComponent,
    UserComponent,
    LoadingComponent,
    NotFoundComponent,
    NewUserComponent,
    PatientsComponent,
    PatientComponent,
    NewPatientComponent,
    ExaminationsComponent,
    ExaminationComponent,
    NewExaminationComponent,
    TherapistExaminationComponent,
    NewTherapistExaminationComponent,
    SurgeonExaminationComponent,
    NewSurgeonExaminationComponent,
    OrthopedistExaminationComponent,
    NewOrthopedistExaminationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MomentDateModule,
    // Material modules
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatPaginatorModule,
    MatMenuModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl() },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
