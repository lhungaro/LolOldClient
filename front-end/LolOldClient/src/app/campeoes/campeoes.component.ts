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

  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService) {  }

  GetUser(){
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

}
