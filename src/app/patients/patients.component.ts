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
  startWith,
} from 'rxjs/operators';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit {
  searchFieldControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three', 'Four'];
  searchResults!: Observable<string[]>;

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
      map((value) => this._filter(value))
    );
    this.loadingService.startLoading();
    this.patientsService.getAll().subscribe((patients) => {
      this.patients = patients.patients;
      this.loadingService.stopLoading();
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
