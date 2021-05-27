import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment';
import { Moment } from 'moment';
import { Patient } from './patients.service';
import { User } from './user.service';

export enum ExaminationType {
  GENERAL = 'general',
  THERAPIST = 'therapist',
  SURGEON = 'surgeon',
  ORTHOPEDIST = 'orthopedist',
}

export interface ExaminationPost {
  complaints: string;
  anamnesis: string;
  objectively: string;
  diagnosis: string;
  recomendations: string;
  user_id: number;
  patient_id: number;
  type: ExaminationType;
}

export interface TherapistExaminationPost extends ExaminationPost {
  condition: string;
  conscious: string;
  cyanosis: string;
  mucous: string;
  food: string;
  lymph_nodes: string;
  rib_cage: string;
  lungs: string;
  breath: string;
  heart: string;
  tongue: string;
  stomach: string;
  liver: string;
  kidneys: string;
  swelling: string;
  diuresis: string;
}

export interface SurgeonExaminationPost extends ExaminationPost {
  condition: string;
  stomach: string;
  hernia: string;
  operations: string;
  trauma: string;
  pathology: string;
}

export interface OrthopedistExaminationPost extends ExaminationPost {
  spine_axis: string;
  upper_limb_axis: string;
  lower_limb_axis: string;
  asymmetry: string;
  upper_limb_joints_functions: string;
  lower_limb_joints_functions: string;
  foot_deformation: string;
  neurovascular_disorders: string;
}

export interface Examination extends ExaminationPost {
  id: number;
  datetime: string;
  user: User;
  patient: Patient;
}

export interface TherapistExamination
  extends Examination,
    TherapistExaminationPost {}

export interface SurgeonExamination
  extends Examination,
    SurgeonExaminationPost {}

export interface OrthopedistExamination
  extends Examination,
    OrthopedistExaminationPost {}

export interface ExaminationInfo {
  id: number;
  datetime: string;
  type: ExaminationType;
  user: User;
  patient: Patient;
}

export interface Examinations {
  total: number;
  examinations: ExaminationInfo[];
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
    return this.http.get<
      | Examination
      | TherapistExamination
      | SurgeonExamination
      | OrthopedistExamination
    >(`${environment.apiUrl}/examinations/${id}`);
  }

  post(
    examination:
      | ExaminationPost
      | TherapistExaminationPost
      | SurgeonExaminationPost
      | OrthopedistExaminationPost
  ) {
    return this.http.post<
      | Examination
      | TherapistExamination
      | SurgeonExamination
      | OrthopedistExamination
    >(`${environment.apiUrl}/examinations`, examination);
  }

  put(
    id: number,
    examination:
      | ExaminationPost
      | TherapistExaminationPost
      | SurgeonExaminationPost
      | OrthopedistExaminationPost
  ) {
    return this.http.put<
      | Examination
      | TherapistExamination
      | SurgeonExamination
      | OrthopedistExamination
    >(`${environment.apiUrl}/examinations/${id}`, examination);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/examinations/${id}`);
  }
}
