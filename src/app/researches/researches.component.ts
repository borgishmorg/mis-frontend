import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import * as _moment from 'moment';
import { Research, ResearchesService } from '@app/services/researches.service';
import { LoadingService } from '@app/services/loading.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { PermissionEnum } from '@app/auth.guard';

@Component({
  selector: 'app-researches',
  templateUrl: './researches.component.html',
  styleUrls: ['./researches.component.css'],
})
export class ResearchesComponent implements OnInit {
  @Input() patient_id?: number;

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  total = 0;
  researches: Research[] = [];

  moment = _moment;

  constructor(
    private researchesService: ResearchesService,
    private loadingService: LoadingService,
    private authService: AuthenticationService
  ) {}

  get canEditResearches() {
    return this.authService.hasPemission(PermissionEnum.RESEARCHES_EDIT);
  }

  ngOnInit(): void {
    if (this.patient_id) {
      this.loadingService.startLoading();
      this.researchesService
        .getAll(this.patient_id, 0, this.pageSize)
        .subscribe((researches) => {
          this.total = researches.total;
          this.researches = researches.researches;
          this.loadingService.stopLoading();
        });
    }
  }

  changePage(pageEvent: PageEvent) {
    if (this.patient_id) {
      this.researchesService
        .getAll(
          this.patient_id,
          pageEvent.pageIndex * pageEvent.pageSize,
          pageEvent.pageSize
        )
        .subscribe((researches) => {
          this.total = researches.total;
          this.researches = researches.researches;
        });
    }
  }
}
