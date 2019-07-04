import { Component, OnInit } from '@angular/core';
import { Consultation } from '../model/consultation';
import { DataService } from '../services/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-consultation',
  templateUrl: './detail-consultation.component.html',
  styleUrls: ['./detail-consultation.component.scss']
})
export class DetailConsultationComponent implements OnInit {

  constructor(private dataService: DataService,private _router: Router,) { }

  consultation: Consultation;
  ngOnInitIsLoaded: Promise<boolean>;

  ngOnInit() {
    const that=this;
    if (that.dataService.consultation != null){
      that.consultation = that.dataService.consultation;
    } else {
      this._router.navigate(['agendaGeneral']);
    }
    this.ngOnInitIsLoaded = Promise.resolve(true);
  }

  mouseOver() {
    // actualiser la page
  }

}
