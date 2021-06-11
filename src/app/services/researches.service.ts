import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment';
import { Patient } from './patients.service';
import { User } from './user.service';

export interface ResearchIn {
  research_name: string;
  patient_id: number;
  research_file?: File;
}

export interface Research {
  id: number;
  datetime: string;
  name: string;
  filetype: string;
  user: User;
  patient: Patient;
}

export interface Researches {
  total: number;
  researches: Research[];
}

@Injectable({
  providedIn: 'root',
})
export class ResearchesService {
  constructor(private http: HttpClient) {}

  getAll(patient_id: number, offset: number = 0, limit: number = 50) {
    return this.http.get<Researches>(`${environment.apiUrl}/researches`, {
      params: {
        patient_id: patient_id.toString(),
        offset: offset.toString(),
        limit: limit.toString(),
      },
    });
  }

  get(id: number) {
    return this.http.get<Research>(`${environment.apiUrl}/researches/${id}`);
  }

  getFile(id: number) {
    return this.http.get(`${environment.apiUrl}/researches/${id}/file`, {
      responseType: 'blob',
    });
  }

  post(research: ResearchIn) {
    const formData = new FormData();
    if (research.research_file)
      formData.append('research_file', research.research_file);
    formData.append('research_name', research.research_name);
    formData.append('patient_id', research.patient_id.toString());
    return this.http.post<Research>(
      `${environment.apiUrl}/researches`,
      formData
    );
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/researches/${id}`);
  }
}
