import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account';
import { Mastery } from '../models/mastery';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  username:string = "Yngvl#BR1";
  iconUrl:string = "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/588.png"
  urlChampion1:string = ""
  urlChampion2:string = ""
  urlChampion3:string = ""
  championName1:string = ""
  championName2:string = ""
  championName3:string = ""
  urlImgRank:string= "../../assets/tier-icons/tier-icons/diamond_i.png"
  elo:string = "Diamante I"
  pdls:string = "87 PDL"
  account!: Account;
  mastery!: Mastery[];
  masterys: Mastery[] = [];
  
  constructor(private accountService:AccountService) { }

  ngOnit(){
    this.GetUser();
  }

  GetUser(){
    console.log(this.username);
    
    if(this.username){

      this.accountService.getIdAccountByNameBr(this.username).subscribe({
        next: (_account:Account) => {
          this.account = _account
          console.log("Sucesso");
          console.log(this.account);
        },
        error: (error:any) => {
          // this.spinner.hide();
          console.log('Erro ao carregar o Usuário','Erro!');
        },
         complete: () => {
          if(this.account!= null){
            this.GetMasterys();
          }
        }
      });
    }
  }

  GetMasterys(){
    if(this.account!= null){
      this.accountService.getMaestriasByPiuuId(this.account.puuid).subscribe({
        next: (_mastery:Mastery[]) => {
          this.mastery = _mastery
          console.log("Sucesso");
          console.log(this.mastery);
        },
        error: (error:any) => {
          // this.spinner.hide();
          console.log('Erro ao carregar as Maestrias','Erro!');
        },
         complete: () => {
          this.populaMasterys()
        }
      });
    }
  }

  populaMasterys(){
    for(let i = 0; i < 3; i++){
      this.masterys.push(this.mastery[i]);
      console.log(this.masterys[i].champName)
      console.log(this.masterys[i].champUrlImg)
    }

    this.championName1 = this.mastery[0].champName ?? "";
    this.championName2 = this.mastery[1].champName ?? "";
    this.championName3 = this.mastery[2].champName ?? "";
    this.urlChampion1 = this.mastery[0].champUrlImg ?? "";
    this.urlChampion2 = this.mastery[1].champUrlImg ?? "";
    this.urlChampion3 = this.mastery[2].champUrlImg ?? "";
  }
}
