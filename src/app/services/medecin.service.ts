import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { catchError,tap,map } from 'rxjs/operators';
import { Medecin } from '../model/medecin'

const httpOptions = {
  headers: new HttpHeaders({'Content-type':'application/json'})
};

const apiUrl = "http://localhost:8080/projetMedical/medecin-api/";

@Injectable({
  providedIn: 'root'
})
export class MedecinService {

  constructor(private http: HttpClient) { }

  getMedecins (): Observable<Medecin[]>{
    return this.http.get<Medecin[]>(apiUrl+"list").pipe();
  }

  getMedecin (idMedecin: number): Observable<Medecin>{
    return this.http.get<Medecin>(apiUrl+"medecin?idMedecin="+idMedecin).pipe();
  }

  addMedecin (Medecin: Medecin): Observable<Medecin>{
    return this.http.post<Medecin>(apiUrl+"add",Medecin).pipe();
  }

  updateMedecin (Medecin: Medecin): Observable<Medecin>{
    return this.http.put<Medecin>(apiUrl+"update",Medecin).pipe();
  }

  deleteListeMedecins (listeMedecins: Medecin[]): Observable<any>{
    return this.http.post<Medecin[]>(apiUrl+"deleteList",listeMedecins).pipe();
  }

  deleteMedecinById (id: number): Observable<any>{
    return this.http.delete<any>(apiUrl+"delete?idMedecin="+id).pipe();
  }

}
