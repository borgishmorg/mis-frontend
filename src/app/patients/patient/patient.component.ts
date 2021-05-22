import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionEnum } from '@app/auth.guard';
import { AuthenticationService } from '@app/services/authentication.service';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import { Patient, PatientsService } from '@app/services/patients.service';
import { throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import * as _moment from 'moment';
import { ExaminationsService } from '@app/services/examinations.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
})
export class PatientComponent implements OnInit {
  patient?: Patient;
  oldPatient?: Patient;

  moment = _moment;

  editing = false;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService,
    private patientsService: PatientsService,
    private examinationsService: ExaminationsService
  ) {}

  get canSeeExaminationsTab() {
    return this.authService.hasPemissions([PermissionEnum.EXAMINATIONS_VIEW]);
  }

  get canEdit() {
    return this.authService.hasPemission(PermissionEnum.PATIENTS_EDIT);
  }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.route.paramMap
      .pipe(
        mergeMap((params) => {
          const patient_id = params.get('patient_id');
          if (!patient_id || !+patient_id) return throwError('');
          return this.patientsService.get(+patient_id);
        })
      )
      .pipe(
        catchError((error) => {
          this.router.navigate(['notfound']);
          return throwError(error);
        })
      )
      .subscribe((patient) => {
        this.patient = patient;
        this.oldPatient = JSON.parse(JSON.stringify(patient));
        this.loadingService.stopLoading();
      });
  }

  back() {
    this.router.navigate(['/patients']);
  }

  edit() {
    this.editing = true;
  }

  discard() {
    this.patient = JSON.parse(JSON.stringify(this.oldPatient));
  }

  save() {
    if (this.patient) {
      this.loadingService.startLoading();
      this.patientsService
        .put(this.patient.id, this.patient)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            this.loadingService.stopLoading();
            return throwError(error);
          })
        )
        .subscribe((patient) => {
          this.patient = patient;
          this.oldPatient = JSON.parse(JSON.stringify(patient));
          this.editing = false;
          this.loadingService.stopLoading();
        });
    }
  }

  delete() {
    if (this.patient) {
      this.patientsService
        .delete(this.patient.id)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            return throwError(error);
          })
        )
        .subscribe(() => {
          this.router.navigate(['/patients']);
        });
    }
  }
}
