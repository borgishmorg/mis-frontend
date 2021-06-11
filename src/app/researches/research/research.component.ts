import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionEnum } from '@app/auth.guard';
import { AuthenticationService } from '@app/services/authentication.service';
import { Research, ResearchesService } from '@app/services/researches.service';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import { throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import * as _moment from 'moment';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css'],
})
export class ResearchComponent implements OnInit {
  research?: Research;

  moment = _moment;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService,
    private researchesService: ResearchesService
  ) {}

  get canView() {
    return this.authService.hasPemissions([PermissionEnum.RESEARCHES_VIEW]);
  }

  get canEdit() {
    return this.authService.hasPemission(PermissionEnum.RESEARCHES_EDIT);
  }

  ngOnInit(): void {
    let _patient_id = -1;
    this.loadingService.startLoading();
    this.route.paramMap
      .pipe(
        mergeMap((params) => {
          const research_id = params.get('research_id');
          const patient_id = params.get('patient_id');
          if (!research_id || !+research_id || !patient_id || !+patient_id)
            return throwError('');
          _patient_id = +patient_id;
          return this.researchesService.get(+research_id);
        })
      )
      .pipe(
        catchError((error) => {
          this.router.navigate(['notfound']);
          return throwError(error);
        })
      )
      .subscribe((research) => {
        this.research = research;
        if (research.patient.id !== _patient_id)
          this.router.navigate(['notfound']);
        this.loadingService.stopLoading();
      });
  }

  back() {
    this.router.navigate([`/patients/${this.research?.patient.id}`]);
  }

  download() {
    if (this.research) {
      this.loadingService.startLoading();
      this.researchesService.getFile(this.research.id).subscribe((x) => {
        const data = window.URL.createObjectURL(x);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.research?.name + '.' + this.research?.filetype;
        link.click();
        this.loadingService.stopLoading();
      });
    }
  }

  delete() {
    if (this.research) {
      this.researchesService
        .delete(this.research.id)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            return throwError(error);
          })
        )
        .subscribe(() => {
          this.router.navigate([`/patients/${this.research?.patient.id}`]);
        });
    }
  }

  get patientFullName() {
    return (
      (this.research?.patient.surname ? this.research?.patient.surname : '') +
      ' ' +
      (this.research?.patient.first_name
        ? this.research?.patient.first_name
        : '') +
      ' ' +
      (this.research?.patient.patronymic
        ? this.research?.patient.patronymic
        : '')
    );
  }

  get doctorFullName() {
    return (
      (this.research?.user.surname ? this.research?.user.surname : '') +
      ' ' +
      (this.research?.user.first_name ? this.research?.user.first_name : '') +
      ' ' +
      (this.research?.user.patronymic ? this.research?.user.patronymic : '')
    );
  }
}
