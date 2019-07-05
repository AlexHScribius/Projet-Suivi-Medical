import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Inject,
  OnDestroy,
  EventEmitter,
  Injectable,
  Output
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  getMinutes,
  isSameHour,
  isToday,
  isThisQuarter
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter,
  CalendarUtils ,
  DAYS_OF_WEEK,
  CalendarMonthViewDay,
  CalendarDayViewComponent
} from 'angular-calendar';
import {
  DayView,
  DayViewEvent,
  GetDayViewArgs
} from 'calendar-utils';
import { stringify } from 'querystring';
import { isNull } from 'util';
import { CustomDateFormatter } from '../agenda-general/custom-date-formatter.provider';
import { DOCUMENT } from '@angular/common'; 
import { DayViewSchedulerComponent } from './day-view-scheduler.component';
import { Router } from '@angular/router';

import { Consultation } from '../model/consultation';
import { ConsultationService } from '../services/consultation.service';
import { DataService } from '../services/data.service';
import { Medecin } from '../model/medecin';
import { MedecinService } from '../services/medecin.service';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-agenda-general',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./agenda-general.component.scss'],
  templateUrl: './agenda-general.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ],
  styles: [
    `
      .cell-totals {
        margin: 5px;
        text-align: center;
      }
      .badge {
        margin-right: 5px;
      }
    `
  ]
})

export class AgendaGeneralComponent implements OnInit,OnDestroy {
  
  constructor(
    private modalService: NgbModal,
    private consultationService: ConsultationService,
    private medecinService: MedecinService,
    private dataService: DataService,
    private modal: NgbModal,
    private _router: Router,
    @Inject(DOCUMENT) documents)
  {}

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  view: CalendarView = CalendarView.Month;

  locale: string = 'fr';

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  CalendarView = CalendarView; // ???????

  viewDate: Date = new Date();

  clickedDateStart: Date;
  clickedDateEnd: Date;

  selectedDayViewDate: Date;

  activeDayIsOpen: boolean = true;
  activeHourIsOpen: boolean = true;

  eventClickedObject: CalendarEvent;

  refresh: Subject<any> = new Subject();
  
  events: CalendarEvent[] = [];

  consultations: Consultation[];
  consultationTemporaire: Consultation;
  medecins: Medecin[];
  medecinTemporaire: Medecin;

  ngOnInitIsLoaded: Promise<boolean>;

  closeResult: string;

  elementClicked: string;

  ngOnInit() {
    const that = this;
    this.medecinService.getMedecins().subscribe(
      res => {
        that.medecins = res;
        console.log(that.medecins);
      }
    );
    this.consultationService.getConsultations().subscribe( // recherche de la liste des consultations
      res => {
        that.consultations = res;
        for (let i=0 ; i<that.consultations.length ; i++){
          let title: string = '';
          if (isNull(that.consultations[i]['prenomPatient']) && isNull(that.consultations[i]['nomPatient'])){
            title='Consultation (Patient inconnu)'
          } else {
            title=(that.consultations[i]['prenomPatient']+" "+that.consultations[i]['nomPatient']).trim();
          }
          let end: Date;
          if (isNull(that.consultations[i]['date'])){
            end = new Date();
          } else {
            end = new Date(that.consultations[i]['date']);
            end.setMinutes(end.getMinutes()+60,0,0);
          }
          let color: any;
          let annulee: boolean;
          let effectuee: boolean;
          let now: Date = new Date();
          let type: string;
          if (that.consultations[i]['annulee'] === true){
            color = colors.red;
            annulee = true;
            effectuee = false;
            type = "danger";
          } else {
            annulee = false;
            if (new Date(that.consultations[i]['date']) < now){
              color = colors.yellow;
              effectuee = true;
              type = "warning";
            } else {
              color = colors.blue;
              effectuee = false;
              type = "info";
            }
          }
          this.medecinService.getMedecin(+this.consultations[i]['idMedecin']).subscribe(
            res => {
              that.medecinTemporaire = res;

              that.events = [
                ...that.events,
                {
                  id: that.consultations[i]['idConsultation'],
                  title: title,
                  start: new Date(that.consultations[i]['date']),
                  end: end,
                  color: color,
                  allDay: false,
                  draggable: false,
                  resizable: {
                    beforeStart: false,
                    afterEnd: false
                  },
                  meta: {
                    medecin: that.medecinTemporaire,
                    annulee: annulee,
                    effectuee: effectuee,
                    type: type
                  },
                }
              ];
            }
          );
        }
      }
    );
    this.ngOnInitIsLoaded = Promise.resolve(true);
  }

  mouseOver(){ // pour actualiser la page
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(cell => {
      const groups: any = {};
      cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
        groups[event.meta.type] = groups[event.meta.type] || [];
        groups[event.meta.type].push(event);
      });
      cell['eventGroups'] = Object.entries(groups);
    });
  }

  private getDismissReason(reason: any): string { // appelé par le modal en cas d'erreur
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): Date {
    this.elementClicked = "day"; // indique que l'élément cliqué est un day
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
    this.setView(CalendarView.Day);
    return date;
  }

  hourSegmentClicked( date : Date, content ) : void {
    this.elementClicked = "hourSegment"; // indique que l'élément cliqué est un hourSegment (dayView du calendar)
    this.selectedDayViewDate = date;
    if (isSameDay(date,this.viewDate)){
      this.viewDate = date;
      if (isSameHour(date,this.viewDate) && this.activeHourIsOpen === true){
        this.activeHourIsOpen = false;
      } else {
        this.activeHourIsOpen = true;
      }
    }
    this.clickedDateStart=new Date(date);
    this.clickedDateEnd=new Date(this.clickedDateStart);
    this.clickedDateEnd.setMinutes(this.clickedDateEnd.getMinutes()+60,0,0);
    var now: Date = new Date();
    if (now <= this.clickedDateStart){
      this.modalService.open(content).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      alert('Vous essayez de créer un rendez-vous dans le passé, lol')
    }
  }

  eventTimesChanged({event,newStart,newEnd}: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  eventClicked( event:CalendarEvent, content2 ): void {
    this.elementClicked = "event";// indique que l'élément cliqué est un event

    this.eventClickedObject = event;
    
    // affiche le modal #content2 correspondant à l'event cliqué
    this.modalService.open(content2).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  addEvent(): void {
    const that = this;
    this.consultationService.getConsultations().subscribe(
      res => {
        that.consultations = res;
        let max:number = 0;
        for (let i=0;i<that.consultations.length;i++){
          if (that.consultations[i]['idConsultation']>max){
            max = that.consultations[i]['idConsultation']
          }
        }
        this.events = [
          ...this.events,
          {
            id: max,
            title: 'Consultation', // changer pour avoir le nom/prénom de la personne connectée
            start: that.clickedDateStart,
            end: that.clickedDateEnd,
            color: colors.blue,
            allDay: false,
            draggable: false,
            resizable: {
              beforeStart: false,
              afterEnd: false
            }
          }
        ];

      }
    )
    
    this.consultationTemporaire = new Consultation();
    this.consultationTemporaire.date = this.clickedDateStart;
    this.consultationService.addConsultation(this.consultationTemporaire).subscribe(
      res => {
        that.consultationTemporaire = res;
      }
    );
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  deleteEventClicked() {
    const that = this;
    this.consultationService.getConsultation(+this.eventClickedObject['event'].id).subscribe(
      res => {
        that.consultationTemporaire = new Consultation();
        that.consultationTemporaire = res;
        that.consultationTemporaire.annulee = true;
        that.consultationService.updateConsultation(that.consultationTemporaire).subscribe(
          res => {
            that.consultationTemporaire = res;
          }
        );
      }
    );

    this.eventClickedObject['event'].color = colors.red;

    //this.events = this.events.filter(event => event !== this.eventClickedObject['event']);
  }

  setView(view: CalendarView) {
    this.view = view;    
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  consulterConsultation () {
    const that = this;
    this.consultationService.getConsultation(+this.eventClickedObject['event'].id).subscribe(
      res => {
        that.consultationTemporaire = res;
        that.consultationTemporaire.annulee = this.eventClickedObject['event'].meta.annulee;
        that.consultationTemporaire.effectuee = this.eventClickedObject['event'].meta.effectuee;
        this.dataService.consultation = that.consultationTemporaire;
        this._router.navigate(['detailConsultation']);
      }
    );    
  }

  ngOnDestroy() {

  }
}
