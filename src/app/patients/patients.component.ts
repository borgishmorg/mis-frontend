import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoadingService } from '@app/services/loading.service';
import { Patient, PatientsService } from '@services/patients.service';
import { Observable } from 'rxjs';
import * as _moment from 'moment';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  startWith,
} from 'rxjs/operators';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit {
  searchFieldControl = new FormControl();
  searchResults: Observable<Patient[]> | undefined;

  moment = _moment;

  patients: Patient[] = [];

  constructor(
    private patientsService: PatientsService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.searchResults = this.searchFieldControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      mergeMap((q) => this.patientsService.search(q)),
      map((patients) => patients.patients)
    );
    this.loadingService.startLoading();
    this.patientsService.getAll().subscribe((patients) => {
      this.patients = patients.patients;
      this.loadingService.stopLoading();
    });
  }

  search() {
    this.loadingService.startLoading();
    this.patientsService
      .search(this.searchFieldControl.value)
      .subscribe((patients) => {
        this.patients = patients.patients;
        this.loadingService.stopLoading();
      });
  }
}
