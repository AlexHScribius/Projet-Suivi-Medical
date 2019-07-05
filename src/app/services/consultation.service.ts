import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { catchError,tap,map } from 'rxjs/operators';
import { Consultation } from '../model/consultation'

const httpOptions = {
  headers: new HttpHeaders({'Content-type':'application/json'})
};

const apiUrl = "http://localhost:8080/projetMedical/consultation-api/";

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private http: HttpClient) { }

  getConsultations (): Observable<Consultation[]>{
    return this.http.get<Consultation[]>(apiUrl+"list").pipe();
  }

  getConsultation (idConsultation: number): Observable<Consultation>{
    return this.http.get<Consultation>(apiUrl+"consultation?idConsultation="+idConsultation).pipe();
  }

  getConsultationByIdDossierPatient (id: number): Observable<Consultation>{
    return this.http.get<Consultation>(apiUrl+"listInDossierPatient?idDossierPatient="+id).pipe();
  }

  addConsultation (Consultation: Consultation): Observable<Consultation>{
    return this.http.post<Consultation>(apiUrl+"add",Consultation).pipe();
  }

  updateConsultation (Consultation: Consultation): Observable<Consultation>{
    return this.http.put<Consultation>(apiUrl+"update",Consultation).pipe();
  }

  deleteListeConsultations (listeConsultations: Consultation[]): Observable<any>{
    return this.http.post<Consultation[]>(apiUrl+"deleteList",listeConsultations).pipe();
  }

  deleteConsultationById (id: number): Observable<any>{
    return this.http.delete<any>(apiUrl+"delete?idConsultation="+id).pipe();
  }

}
