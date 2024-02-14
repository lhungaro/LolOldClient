import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Champion } from '../models/champion';

@Component({
  selector: 'app-campeoes',
  templateUrl: './campeoes.component.html',
  styleUrls: ['./campeoes.component.css']
})
export class CampeoesComponent {


  champions: Champion[] = [];

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

  ngOnInit(){
    //this.GetChampions();
  }
  carregarCampeoes(){
    this.GetChampions();
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
        this.champions.forEach((a) => {
          console.log(a.image.full);

        });
      }
    });
  }

}
