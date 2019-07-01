import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AgendaGeneralComponent } from './agenda-general/agenda-general.component';

const routes: Routes = [
  {
    path : 'accueil',
    component: AccueilComponent,
    data: {title: 'Accueil Projet suivi médical'}
  },
  {
    path : 'agendaGeneral',
    component: AgendaGeneralComponent,
    data: {title: 'Agenda Général'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
