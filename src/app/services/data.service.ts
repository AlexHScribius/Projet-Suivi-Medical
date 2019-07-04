import { Injectable } from '@angular/core';
import { Consultation } from '../model/consultation'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public consultation: Consultation;
  constructor() { }
}
