import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import { HistoricoComponent } from './historico/historico.component';
import { LigasComponent } from './ligas/ligas.component';
import { CampeoesComponent } from './campeoes/campeoes.component';

const routes: Routes = [
  {path: 'perfil', component : PerfilComponent},
  {path: 'historico', component : HistoricoComponent},
  {path: 'ligas', component : LigasComponent},
  {path: 'campeoes', component : CampeoesComponent},
  {path: 'perfil', component : PerfilComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
