import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment';
import { Moment } from 'moment';
import { Patient } from './patients.service';
import { User } from './user.service';

export interface ExaminationPost {
  complaints: string;
  anamnesis: string;
  diagnosis: string;
  recomendations: string;
  user_id: number;
  patient_id: number;
}

export interface Examination extends ExaminationPost {
  id: number;
  datetime: Moment;
  user: User;
  patient: Patient;
}

export interface Examinations {
  total: number;
  examinations: Examination[];
}

@Injectable({
  providedIn: 'root',
})
export class ExaminationsService {
  constructor(private http: HttpClient) {}

  search(patient_id: number, offset: number = 0, limit: number = 50) {
    return this.http.get<Examinations>(`${environment.apiUrl}/examinations`, {
      params: {
        patient_id: patient_id.toString(),
        offset: offset.toString(),
        limit: limit.toString(),
      },
    });
  }

  getAll() {
    return this.http.get<Examinations>(`${environment.apiUrl}/examinations`);
  }

  get(id: number) {
    return this.http.get<Examination>(
      `${environment.apiUrl}/examinations/${id}`
    );
  }

  post(examination: ExaminationPost) {
    return this.http.post<Examination>(
      `${environment.apiUrl}/examinations`,
      examination
    );
  }

  put(id: number, examination: ExaminationPost) {
    return this.http.put<Examination>(
      `${environment.apiUrl}/examinations/${id}`,
      examination
    );
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/examinations/${id}`);
  }
}
