import { Mastery } from './../models/mastery';
import { Champion } from './../models/champion';
import { Component, NgModule } from '@angular/core';
import { AccountService } from '../services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-campeoes',
  templateUrl: './campeoes.component.html',
  styleUrls: ['./campeoes.component.css']
})
export class CampeoesComponent {

  ordenacao: string = 'Alfabética';
  filtroChamp: any = "";
  filtrobau: string = "false";
  Tanque : string = "Tank";
  Lutador : string = "Fighter";
  Mage :string = "Mage";
  Assassin :string = "Assassin";
  Marksman :string = "Marksman";
  Support :string = "Support";




  puuid: string = '5-9UAP0WP_BqWLHurxIjj1PprptYifhFeHfhWL5AHzQDJ4KiGgaspRtz8Zv7rf0ItIR_Zi2aBkH8zQ'
  champions: Champion[] = [];
  mastery!: Mastery[];
  opcaoEscolhida: string = "";
  classeEscolhida: string = "";

  // Função para dividir o array em grupos de tamanho 'size'
  chunk(array:any, size:any) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }


  constructor(

    private accountService: AccountService,
    private spinner: NgxSpinnerService) {  }

  ngOnInit() {

  }
  carregarCampeoes(){
    // this.GetChampions();
    this.GetMasterys();
  }

  filtrarLista() {
    if(this.filtroChamp != ""){
      return this.mastery.filter(item => item.champName.toLowerCase().includes(this.filtroChamp.toLowerCase()));
    }else if (this.opcaoEscolhida != ""){
      return this.ordenarOpcoes(this.opcaoEscolhida)
    }else if(this.classeEscolhida != ""){
      return this.classeChamp(this.classeEscolhida)
    }
    else
      return this.mastery;
  }

  GetChampions(){
    this.spinner.show();

    this.accountService.getChampions().subscribe({
      next: (_account:Champion[]) => {
        this.champions = _account
      },
      error: (error:any) => {
        // this.spinner.hide();
        console.log('Erro ao carregar o Usuário','Erro!');
      },
        complete: () => {
        this.spinner.hide();
      }
    });
  }

  GetMasterys(){
      this.accountService.getMaestriasByPiuuId(this.puuid).subscribe({
        next: (_mastery:Mastery[]) => {
          this.mastery = _mastery
          console.log("Maestrias");
          console.log(this.mastery);
        },
        error: (error:any) => {
          // this.spinner.hide();
          console.log('Erro ao carregar as Maestrias','Erro!');
        },
         complete: () => {
          this.spinner.hide();
        }
      });
  }

  ordenarOpcoes(opcao: string){
    switch (opcao){

      case 'Alfabetica':
        let _champions = this.mastery.sort((a , b) => a.champName.localeCompare(b.champName));
        return _champions;

      case 'Maestria':
        let _masterys = this.mastery.sort((a , b) =>{
        if(a.championLevel !== undefined && b.championLevel !== undefined){
          return b.championLevel.localeCompare(a.championLevel)
        }
        return 0;
      });

        return _masterys;

        case 'Bau-disponivel':
          if(this.filtrobau == "false"){
            return this.mastery.filter(item => item.chestGranted && item.chestGranted.includes(this.filtrobau));

          }
        break;


      }
    return this.mastery
  }

  classeChamp(opcaoChamp: string){


    switch(opcaoChamp){
      case 'Todos':

      break;

      case 'Tank':

        if(this.Tanque === "Tank"){
          return this.mastery.filter(item =>  item.tags.includes("Tank"));

        }
      break;


    }
    return this.mastery
  }



}

