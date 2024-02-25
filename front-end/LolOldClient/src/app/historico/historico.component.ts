import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Match, Participant } from '../models/match';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent {
  
  constructor(
    private accountService:AccountService,
    private spinner: NgxSpinnerService
  ) { }

  matchs: Match[] =[];
  match!: Match;
  piuud = 'vYOv-b761KU2zv6nvSrcsf0oueW9wowjsHHx8NP8j7azWl0MztXIkpsB3PRYWaAGXfMbFmz0e9yjsg';


  ngOnInit(){
    this.GetMatchs();
  }

  GetMatchs(){
    this.spinner.show();
    this.accountService.getMatchInformations(this.piuud).subscribe({
      next: (_matchs:Match[]) => {
        this.matchs = _matchs;
        console.log("Sucesso");
      },
      error: (error:any) => {
        console.log('Erro ao carregar partidas','Erro!');
        this.spinner.hide();
      },
      complete: () => {
          this.spinner.hide();
          this.match = this.matchs[0];
          console.log(this.match);
          
      }
    });
  }

  verificaSeStatus(win:boolean){
    if(win)
      return "Vitória";
    else
      return "Derrota"
  }

  formatarTempo(time: number): string {
    let timeString = time.toString()
    return timeString.match(/.{1,2}/g)?.join(':') || '';
  }

  montaKDA(praticipant:Participant){
    let kill = praticipant.kills;
    let deaths = praticipant.deaths;
    let assists = praticipant.assists;

    return kill + "/" + deaths + "/" + assists;
  }

  formataGold(gold:number){

    if (gold < 1000) {
        return gold.toString();
    } else if (gold < 10000) {
        return (gold / 1000).toFixed(0) + 'mil';
    } else {
        return (gold / 1000).toFixed(0) + 'mil';
    }
  }

  converterDataUnixParaNormal(timestamp: number): string {
    const data = new Date(timestamp);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano}`;
}

}
