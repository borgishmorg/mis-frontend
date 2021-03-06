import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionEnum } from '@app/auth.guard';
import { AuthenticationService } from '@app/services/authentication.service';
import {
  ExaminationsService,
  TherapistExamination,
} from '@app/services/examinations.service';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import { jsPDF } from 'jspdf';
import * as _moment from 'moment';
import { throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-therapist-examination',
  templateUrl: './therapist-examination.component.html',
  styleUrls: ['./therapist-examination.component.css'],
})
export class TherapistExaminationComponent implements OnInit {
  examination?: TherapistExamination;
  oldExamination?: TherapistExamination;

  editing = false;

  moment = _moment;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService,
    private examinationsService: ExaminationsService
  ) {}

  get canView() {
    return this.authService.hasPemissions([
      PermissionEnum.THERAPIST_EXAMINATIONS_VIEW,
    ]);
  }

  get canEdit() {
    return this.authService.hasPemission(
      PermissionEnum.THERAPIST_EXAMINATIONS_EDIT
    );
  }

  ngOnInit(): void {
    let _patient_id = -1;
    this.loadingService.startLoading();
    this.route.paramMap
      .pipe(
        mergeMap((params) => {
          const examination_id = params.get('examination_id');
          const patient_id = params.get('patient_id');
          if (
            !examination_id ||
            !+examination_id ||
            !patient_id ||
            !+patient_id
          )
            return throwError('');
          _patient_id = +patient_id;
          return this.examinationsService.get(+examination_id);
        })
      )
      .pipe(
        catchError((error) => {
          this.router.navigate(['notfound']);
          return throwError(error);
        })
      )
      .subscribe((examination) => {
        this.examination = <TherapistExamination>examination;
        if (examination.patient_id !== _patient_id)
          this.router.navigate(['notfound']);
        this.oldExamination = JSON.parse(JSON.stringify(examination));
        this.loadingService.stopLoading();
      });
  }

  back() {
    this.router.navigate([`/patients/${this.examination?.patient_id}`]);
  }

  edit() {
    this.editing = true;
  }

  discard() {
    this.examination = JSON.parse(JSON.stringify(this.oldExamination));
  }

  save() {
    if (this.examination) {
      this.loadingService.startLoading();
      this.examinationsService
        .put(this.examination.id, this.examination)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            this.loadingService.stopLoading();
            return throwError(error);
          })
        )
        .subscribe((examination) => {
          this.examination = <TherapistExamination>examination;
          this.oldExamination = JSON.parse(JSON.stringify(examination));
          this.editing = false;
          this.loadingService.stopLoading();
        });
    }
  }

  delete() {
    if (this.examination) {
      this.examinationsService
        .delete(this.examination.id)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            return throwError(error);
          })
        )
        .subscribe(() => {
          this.router.navigate([`/patients/${this.examination?.patient_id}`]);
        });
    }
  }

  get patientFullName() {
    return (
      (this.examination?.patient.surname
        ? this.examination?.patient.surname
        : '') +
      ' ' +
      (this.examination?.patient.first_name
        ? this.examination?.patient.first_name
        : '') +
      ' ' +
      (this.examination?.patient.patronymic
        ? this.examination?.patient.patronymic
        : '')
    );
  }

  get doctorFullName() {
    return (
      (this.examination?.user.surname ? this.examination?.user.surname : '') +
      ' ' +
      (this.examination?.user.first_name
        ? this.examination?.user.first_name
        : '') +
      ' ' +
      (this.examination?.user.patronymic
        ? this.examination?.user.patronymic
        : '')
    );
  }

  pdf() {
    const doc = new jsPDF({});
    const header = '???????????? ??????????????????';
    const text = `
????????: ${_moment
      .utc(this.examination?.datetime)
      .local()
      .format('D MMMM YYYY')} ??????????: ${_moment
      .utc(this.examination?.datetime)
      .local()
      .format('HH:mm')}

????????????: ${this.examination?.complaints}
??????????????: ${this.examination?.anamnesis}
????????????????????: ??????????????????: ${this.examination?.condition}.
????????????????: ${this.examination?.conscious}. ????????????: ${
      this.examination?.cyanosis
    }. ??????????????????: ${this.examination?.mucous}.
??????????????: ${this.examination?.food}.
??????????. ??/????????: ${this.examination?.lymph_nodes}.
?????????????? ????????????: ${this.examination?.rib_cage}.
???????????????????? ?????? ??????????????: ${this.examination?.lungs}.
??????????????: ${this.examination?.breath}.
????????????: ${this.examination?.heart}.
????????: ${this.examination?.tongue}.
??????????: ${this.examination?.stomach}.
????????????: ${this.examination?.liver}.
??????????: ${this.examination?.kidneys}.
???????????????????????????? ??????????: ${this.examination?.swelling}.
????????????: ${this.examination?.diuresis}.
${this.examination?.objectively}
??????????????: ${this.examination?.diagnosis}
????????????????????????: ${this.examination?.recomendations}

????????: ${this.doctorFullName}
    `;
    doc.setFontSize(16);
    doc.setFont('OpenSans', 'bold');
    doc.text(header, 105, 15, {
      align: 'center',
    });
    doc.setFontSize(14);
    doc.setFont('OpenSans', 'normal');
    doc.text(doc.splitTextToSize(text, 190), 10, 25, {});
    doc.save(
      `${header} ${this.patientFullName} ${_moment(this.examination?.datetime)
        .local()
        .format('D MMMM YYYY')}`
    );
  }
}
