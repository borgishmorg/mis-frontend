import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionEnum } from '@app/auth.guard';
import { AuthenticationService } from '@app/services/authentication.service';
import {
  ExaminationPost,
  ExaminationsService,
  ExaminationType,
} from '@app/services/examinations.service';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import { throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import * as _moment from 'moment';
import { Patient, PatientsService } from '@app/services/patients.service';
import { User, UsersService } from '@app/services/user.service';

@Component({
  selector: 'app-new-examination',
  templateUrl: './new-examination.component.html',
  styleUrls: ['./new-examination.component.css'],
})
export class NewExaminationComponent implements OnInit {
  examination?: ExaminationPost;
  oldExamination?: ExaminationPost;

  patient?: Patient;
  user?: User;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService,
    private examinationsService: ExaminationsService,
    private patientsService: PatientsService,
    private usersService: UsersService
  ) {}

  get canView() {
    return this.authService.hasPemissions([PermissionEnum.EXAMINATIONS_VIEW]);
  }

  get canEdit() {
    return this.authService.hasPemission(PermissionEnum.EXAMINATIONS_EDIT);
  }

  ngOnInit(): void {
    if (this.authService.userValue) {
      this.loadingService.startLoading();
      const user_id = this.authService.userValue.id;

      this.usersService
        .get(user_id)
        .pipe(
          mergeMap((user) => {
            this.user = user;
            return this.route.paramMap;
          })
        )
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
          this.examination = {
            anamnesis: '',
            complaints: '',
            objectively: '',
            diagnosis: '',
            recomendations: '',
            type: ExaminationType.GENERAL,
            user_id: user_id,
            patient_id: patient.id,
          };
          this.oldExamination = JSON.parse(JSON.stringify(this.examination));
          this.loadingService.stopLoading();
        });
    }
  }

  back() {
    this.router.navigate([`/patients/${this.examination?.patient_id}`]);
  }

  discard() {
    this.examination = JSON.parse(JSON.stringify(this.oldExamination));
  }

  save() {
    if (this.examination) {
      this.loadingService.startLoading();
      this.examinationsService
        .post(this.examination)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            this.loadingService.stopLoading();
            return throwError(error);
          })
        )
        .subscribe((examination) => {
          this.router.navigate([
            `/patients/${examination.patient_id}/examinations/${examination.type}/${examination.id}`,
          ]);
        });
    }
  }
}
