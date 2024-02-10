import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  Username:string = "Yngvl";
  iconUrl:string = "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/588.png"
  urlChampion:string = "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/Aatrox.png"
  championName:string = "Aatrox"
}
