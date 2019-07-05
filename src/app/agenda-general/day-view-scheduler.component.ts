import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CalendarDayViewComponent, CalendarUtils } from 'angular-calendar';
import { DayView, DayViewEvent, GetDayViewArgs } from 'calendar-utils';
import { Medecin } from '../model/medecin';

const EVENT_WIDTH = 150;

// extend the interface to add the array of medecins
interface DayViewScheduler extends DayView {
  medecins: any[];
}

@Injectable()
export class DayViewSchedulerCalendarUtils extends CalendarUtils {
  getDayView(args: GetDayViewArgs): DayViewScheduler {
    const view: DayViewScheduler = {
      ...super.getDayView(args),
      medecins: []
    };
    view.events.forEach(({ event }) => {
      // s'assurer que les objets de classe Medecin ont les mêmes références,
      // Si 2 medecins ont la même structure mais des références différentes, cela échouera
      if (!view.medecins.includes(event.meta.medecin)) {
        view.medecins.push(event.meta.medecin);
      }
    });

    // Trie les médecins par ordre alphabétiques
    view.medecins.sort((medecin1: Medecin, medecin2: Medecin) => {
      if (medecin1['nomMedecin'] < medecin2['nomMedecin'])
        return -1;
      if (medecin1['nomMedecin'] > medecin2['nomMedecin'])
        return 1;
      return 0;
    });
    view.events = view.events.map(dayViewEvent => {
      const index = view.medecins.indexOf(dayViewEvent.event.meta.medecin);
      dayViewEvent.left = index * EVENT_WIDTH; // change the column of the event
      return dayViewEvent;
    });
    view.width = view.medecins.length * EVENT_WIDTH;
    return view;
  }
} 


@Component({
  // tslint:disable-line max-classes-per-file
  selector: 'mwl-day-view-scheduler',
  styles: [
    `
      .day-view-column-headers {
        display: flex;
        margin-left: 70px;
      }
      .day-view-column-header {
        width: 150px;
        border: solid 1px black;
        text-align: center;
      }
    `
  ],
  providers: [
    {
      provide: CalendarUtils,
      useClass: DayViewSchedulerCalendarUtils
    }
  ],
  templateUrl: 'day-view-scheduler.component.html'
})

export class DayViewSchedulerComponent extends CalendarDayViewComponent {
  view: DayViewScheduler;

  @Output() medecinChanged = new EventEmitter();

  eventDragged(dayEvent: DayViewEvent, xPixels: number, yPixels: number): void {
    super.dragEnded(dayEvent, { y: yPixels, x: 0 } as any); // original behaviour
    if (xPixels !== 0) {
      const columnsMoved = xPixels / EVENT_WIDTH;
      const currentColumnIndex = this.view.medecins.findIndex(
        medecin => medecin === dayEvent.event.meta.medecin
      );
      const newIndex = currentColumnIndex + columnsMoved;
      const newMedecin = this.view.medecins[newIndex];
      if (newMedecin) {
        this.medecinChanged.emit({ event: dayEvent.event, newMedecin });
      }
    }
  }
}