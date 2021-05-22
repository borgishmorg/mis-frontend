import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import {
  PatientPost,
  PatientsService,
  Sex,
} from '@app/services/patients.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as _moment from 'moment';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css'],
})
export class NewPatientComponent implements OnInit {
  patient?: PatientPost;
  oldPatient?: PatientPost;

  moment = _moment;

  editing = false;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService,
    private patientsService: PatientsService
  ) {}

  ngOnInit(): void {
    this.patient = {
      first_name: '',
      surname: '',
      patronymic: '',
      address: '',
      phone: '',
      email: '',
      sex: Sex.NOT_KNOWN,
      birthdate: this.moment(),
    };
    this.oldPatient = JSON.parse(JSON.stringify(this.patient));
  }

  back() {
    this.router.navigate(['/patients']);
  }

  discard() {
    this.patient = JSON.parse(JSON.stringify(this.oldPatient));
  }

  save() {
    if (this.patient) {
      this.loadingService.startLoading();
      this.patientsService
        .post(this.patient)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            this.loadingService.stopLoading();
            return throwError(error);
          })
        )
        .subscribe((patient) => {
          this.router.navigate([`/patients/${patient.id}`]);
          this.loadingService.stopLoading();
        });
    }
  }
}
