import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AgendaGeneralComponent } from './agenda-general/agenda-general.component';
import { DetailConsultationComponent } from './detail-consultation/detail-consultation.component'

const routes: Routes = [
  {
    path: 'accueil',
    component: AccueilComponent,
    data: {title: 'Accueil Projet suivi médical'}
  },
  {
    path: 'agendaGeneral',
    component: AgendaGeneralComponent,
    data: {title: 'Agenda Général'}
  },
  {
    path: 'detailConsultation',
    component: DetailConsultationComponent,
    data: {title: 'Consultation'}
  },
  { path: '**', redirectTo: 'accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
