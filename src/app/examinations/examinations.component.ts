import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as _moment from 'moment';
import {
  Examination,
  ExaminationInfo,
  ExaminationsService,
  ExaminationType,
} from '@app/services/examinations.service';
import { LoadingService } from '@app/services/loading.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { PermissionEnum } from '@app/auth.guard';

@Component({
  selector: 'app-examinations',
  templateUrl: './examinations.component.html',
  styleUrls: ['./examinations.component.css'],
})
export class ExaminationsComponent implements OnInit {
  @Input() patient_id?: number;

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  total = 0;
  examinations: ExaminationInfo[] = [];

  moment = _moment;

  constructor(
    private examinationsService: ExaminationsService,
    private loadingService: LoadingService,
    private authService: AuthenticationService
  ) {}

  get canEditExaminations() {
    return this.authService.hasPemission(PermissionEnum.EXAMINATIONS_EDIT);
  }

  ngOnInit(): void {
    if (this.patient_id) {
      this.loadingService.startLoading();
      this.examinationsService
        .search(this.patient_id, 0, this.pageSize)
        .subscribe((examinations) => {
          this.total = examinations.total;
          this.examinations = examinations.examinations;
          this.loadingService.stopLoading();
        });
    }
  }

  changePage(pageEvent: PageEvent) {
    if (this.patient_id) {
      this.examinationsService
        .search(
          this.patient_id,
          pageEvent.pageIndex * pageEvent.pageSize,
          pageEvent.pageSize
        )
        .subscribe((examinations) => {
          this.total = examinations.total;
          this.examinations = examinations.examinations;
        });
    }
  }

  getExaminationTitle(examinationType: ExaminationType): string {
    switch (examinationType) {
      case ExaminationType.GENERAL:
        return 'Общий осмотр';
      case ExaminationType.THERAPIST:
        return 'Терапевтический осмотр';
      case ExaminationType.SURGEON:
        return 'Хирургический осмотр';
      case ExaminationType.ORTHOPEDIST:
        return 'Ортопедический осмотр';
      default:
        return 'Неизвестный отчет';
    }
  }
}
