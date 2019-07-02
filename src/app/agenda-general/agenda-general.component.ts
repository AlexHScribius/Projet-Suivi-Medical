import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Inject
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
  isSameHour
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter,
  DAYS_OF_WEEK
} from 'angular-calendar';
import { CustomDateFormatter } from '../agenda-general/custom-date-formatter.provider';
import { DOCUMENT } from '@angular/common'; 
import { CalendarDayViewHourSegmentComponent } from 'angular-calendar/modules/day/calendar-day-view-hour-segment.component';
import { Consultation } from '../model/consultation';
import { ConsultationService } from '../services/consultation.service';
import { stringify } from 'querystring';
import { isNull } from 'util';

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
  ]
})

export class AgendaGeneralComponent implements OnInit {
  
  constructor(
    private consultationService: ConsultationService,
    private modal: NgbModal,
    @Inject(DOCUMENT) document)
  {}

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  confirmationRdvAffichee: boolean = false;
  confirmationSuppressionAffichee: boolean = false;

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

  refresh: Subject<any> = new Subject();
  
  events: CalendarEvent[] = [];

  consultations: Consultation[];
  consultationTemporaire: Consultation;

  ngOnInitIsLoaded: Promise<boolean>;

  ngOnInit() {
    const that = this;
    this.consultationService.getConsultations().subscribe( // recherche de la liste des consultations
      res => {
        that.consultations = res;
  
        for (let i=0;i<that.consultations.length;i++){
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
          // adapter la couleur au connectedUser
          that.events = [
            ...that.events,
            {
              title: title,
              start: new Date(that.consultations[i]['date']),
              end: end,
              color: colors.red,
              allDay: false,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false
              }
            }
          ];
        }
      }
    );
    this.ngOnInitIsLoaded = Promise.resolve(true);
  }

  mouseEnter(){ // pour actualiser la page
  }

  afficherConfirmationRdv(){
    this.confirmationRdvAffichee=!this.confirmationRdvAffichee;
  }

  afficherConfirmationSuppression(){
    this.confirmationSuppressionAffichee=!this.confirmationSuppressionAffichee;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): Date {
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

  hourSegmentClicked( date : Date ) : void {
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
    this.afficherConfirmationRdv();
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

  eventClicked({ event }: { event: CalendarEvent }): void {
    this.eventClickedObject = event;
    this.afficherConfirmationSuppression();
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'Consultation', // changer pour avoir le nom/prénom de la personne connectée
        start: this.clickedDateStart,
        end: this.clickedDateEnd,
        color: colors.red,
        allDay: false,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false
        }
      }
    ];
    this.consultationTemporaire = new Consultation();
    console.log("consultation temporaire : " + this.consultationTemporaire);
    this.consultationTemporaire.date = this.clickedDateStart;
    const that = this;
    this.consultationService.addConsultation(this.consultationTemporaire).subscribe(
      res => {
        that.consultationTemporaire = res;
      }
    );
    this.afficherConfirmationRdv();
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }

  deleteEventClicked() {
    this.events = this.events.filter(event => event !== this.eventClickedObject);
  }

  setView(view: CalendarView) {
    this.view = view;    
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
