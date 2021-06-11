import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionEnum } from '@app/auth.guard';
import { AuthenticationService } from '@app/services/authentication.service';
import {
  ResearchIn,
  ResearchesService,
} from '@app/services/researches.service';
import { LoadingService } from '@app/services/loading.service';
import { NotificationsService } from '@app/services/notifications.service';
import { throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import * as _moment from 'moment';
import { Patient, PatientsService } from '@app/services/patients.service';
import { User, UsersService } from '@app/services/user.service';

@Component({
  selector: 'app-new-research',
  templateUrl: './new-research.component.html',
  styleUrls: ['./new-research.component.css'],
})
export class NewResearchComponent implements OnInit {
  research?: ResearchIn;
  oldResearch?: ResearchIn;

  patient?: Patient;
  user?: User;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService,
    private researchesService: ResearchesService,
    private patientsService: PatientsService,
    private usersService: UsersService
  ) {}

  get canView() {
    return this.authService.hasPemissions([PermissionEnum.RESEARCHES_VIEW]);
  }

  get canEdit() {
    return this.authService.hasPemission(PermissionEnum.RESEARCHES_EDIT);
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
          this.research = {
            patient_id: patient.id,
            research_name: 'Исследование',
          };
          this.oldResearch = JSON.parse(JSON.stringify(this.research));
          this.loadingService.stopLoading();
        });
    }
  }

  onFileSelected(event: Event) {
    const target = <HTMLInputElement>event.target;
    if (target && target.files && this.research) {
      const file = target.files[0];

      if (file) this.research.research_file = file;
    }
  }

  back() {
    this.router.navigate([`/patients/${this.research?.patient_id}`]);
  }

  discard() {
    this.research = JSON.parse(JSON.stringify(this.oldResearch));
  }

  save() {
    if (this.research) {
      this.loadingService.startLoading();
      this.researchesService
        .post(this.research)
        .pipe(
          catchError((error) => {
            this.notificationsService.error(error);
            this.loadingService.stopLoading();
            return throwError(error);
          })
        )
        .subscribe((research) => {
          this.router.navigate([
            `/patients/${research.patient.id}/researches/${research.id}`,
          ]);
        });
    }
  }
}
