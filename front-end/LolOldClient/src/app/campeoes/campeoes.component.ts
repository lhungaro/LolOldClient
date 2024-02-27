import { Mastery } from './../models/mastery';
import { Champion } from './../models/champion';
import { Component, NgModule } from '@angular/core';
import { AccountService } from '../services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-campeoes',
  templateUrl: './campeoes.component.html',
  styleUrls: ['./campeoes.component.css'],
})
export class CampeoesComponent {
  ordenacao: string = 'Alfabética';
  filtroChamp: any = '';
  filtrobau: string = 'false';
  Tanque: string = 'Tank';
  Lutador: string = 'Fighter';
  Mage: string = 'Mage';
  Assassin: string = 'Assassin';
  Marksman: string = 'Marksman';
  Support: string = 'Support';

  puuid: string =
    '5-9UAP0WP_BqWLHurxIjj1PprptYifhFeHfhWL5AHzQDJ4KiGgaspRtz8Zv7rf0ItIR_Zi2aBkH8zQ';
  champions: Champion[] = [];
  todosCampeoes!: Mastery[];
  opcaoEscolhida: string = '';
  classeEscolhida: string = '';

  // Função para dividir o array em grupos de tamanho 'size'
  chunk(array: any, size: any) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  constructor(
    private accountService: AccountService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}
  carregarCampeoes() {
    this.GetChampions();
    this.GetMasterys();
  }

  filtrarLista(): Mastery[] {
    let campeoes: Mastery[] = [];

    if (this.filtroChamp != '') {
      campeoes = this.todosCampeoes.filter((item) =>
        item.champName.toLowerCase().includes(this.filtroChamp.toLowerCase())
      );
    }
    if (this.opcaoEscolhida != '') {
      let campeoesParaOrdenar =
        this.filtroChamp != '' ? campeoes : this.todosCampeoes;
      campeoes = this.ordenarOpcoes(campeoesParaOrdenar);
    }
    if (this.classeEscolhida != '') {
      let campeoesParaFiltrar =
        this.filtroChamp != '' || this.opcaoEscolhida != ''
          ? campeoes
          : this.todosCampeoes;
      campeoes = this.classeChamp(campeoesParaFiltrar);
    }

    if (
      this.filtroChamp != '' ||
      this.opcaoEscolhida != '' ||
      this.classeEscolhida != ''
    ) {
      return campeoes;
    } else {
      return this.todosCampeoes;
    }
  }

  GetChampions() {
    this.spinner.show();

    this.accountService.getChampions().subscribe({
      next: (_account: Champion[]) => {
        this.champions = _account;
      },
      error: (error: any) => {
        // this.spinner.hide();
        console.log('Erro ao carregar o Usuário', 'Erro!');
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  GetMasterys() {
    this.accountService.getMaestriasByPiuuId(this.puuid).subscribe({
      next: (_mastery: Mastery[]) => {
        this.todosCampeoes = _mastery;
        console.log('Maestrias');
        console.log(this.todosCampeoes);
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log('Erro ao carregar as Maestrias', 'Erro!');
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  ordenarOpcoes(campeoesParaFiltrar: Mastery[]) {
    switch (this.opcaoEscolhida) {
      case 'Alfabetica':
        let _champions = campeoesParaFiltrar.sort((a, b) =>
          a.champName.localeCompare(b.champName)
        );
        return _champions;

      case 'Maestria':
        let _masterys = campeoesParaFiltrar.sort((a, b) => {
          if (a.championLevel !== undefined && b.championLevel !== undefined) {
            return b.championLevel.localeCompare(a.championLevel);
          }
          return 0;
        });

        return _masterys;

      case 'Bau-disponivel':
        if (this.filtrobau == 'false') {
          return campeoesParaFiltrar.filter(
            (item) =>
              item.chestGranted && item.chestGranted.includes(this.filtrobau)
          );
        }
        break;
    }
    return campeoesParaFiltrar;
  }

  classeChamp(campeoesParaFIltrar: Mastery[]): Mastery[] {
    let tag = this.classeEscolhida;
    let filtrados: Mastery[] = [];

    campeoesParaFIltrar.forEach((m) => {
      let champMastery = this.champions.find((c) => c.key == m.championId);
      let tagEncontrada = 0;

      champMastery?.tags.forEach((champTag) => {
        if (champTag == tag) tagEncontrada++;
      });

      if (tagEncontrada > 0) {
        filtrados.push(m);
      }
    });

    if (tag == 'Todos') {
      return campeoesParaFIltrar;
    }

    return filtrados;
  }
}
