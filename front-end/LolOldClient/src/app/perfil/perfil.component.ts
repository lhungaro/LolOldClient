import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account';
import { Mastery } from '../models/mastery';
import { Rank } from '../models/rank';
import { QueueTypeEnum } from '../helpers/queueTypeEnum';
import { RankEnum } from '../helpers/rankEnum';
import { ICON_PATHS, Tier, rankIconMap } from '../helpers/icons.config';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  username:string = "";
  iconUrl:string = ""
  urlChampion1:string = ""
  urlChampion2:string = ""
  urlChampion3:string = ""
  championName1:string = ""
  championName2:string = ""
  championName3:string = ""
  championPoints1:string = ""
  championPoints2:string = ""
  championPoints3:string = ""
  urlImgRankSolo:string= "../../assets/tier-icons/tier-icons/provisional.png"
  urlImgRankTFT:string= "../../assets/tier-icons/tier-icons/provisional.png"
  urlImgRankFlex:string= "../../assets/tier-icons/tier-icons/provisional.png"
  elo:string = "Unranked"
  pdls:string = ""
  account!: Account;
  mastery!: Mastery[];
  masterys: Mastery[] = [];
  ranks: Rank[] = [];
  rankSolo: Rank = {
    queueType: 'Ranked Solo/Duo',
    tier: 'Unranked',
    rank: '',
    leaguePoints: '',
  };
  rankFlex: Rank = {
    queueType: 'Ranked Solo/Duo',
    tier: 'Unranked',
    rank: '',
    leaguePoints: '',
  };
  puuid :string ="";
  accountInformations!: any;

  constructor(private accountService:AccountService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      const parametro = params['puuid'];
      this.puuid = params['puuid'];
      console.log(parametro); // Valor do parâmetro de consulta
    });
    this.showSpinner();
    this.GetMasterys();
    this.GetRank();
    this.GetAccountInformations();
  }


  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  // GetUser(){
  //   console.log(this.username);
  //   this.spinner.show();
  //   if(this.username){

  //     this.accountService.getIdAccountByNameBr(this.username).subscribe({
  //       next: (_account:Account) => {
  //         this.account = _account
  //         console.log("Sucesso");
  //         console.log(this.account);
  //       },
  //       error: (error:any) => {
  //         // this.spinner.hide();
  //         console.log('Erro ao carregar o Usuário','Erro!');
  //       },
  //        complete: () => {
  //         if(this.account!= null){
       
  //         }
  //       }
  //     });
  //   }
  // }

  GetMasterys(){
    if(this.puuid != ""){
      this.accountService.getMaestriasByPiuuId(this.puuid).subscribe({
        next: (_mastery:Mastery[]) => {
          this.mastery = _mastery
        },
        error: (error:any) => {
          this.spinner.hide();
          console.log('Erro ao carregar as Maestrias','Erro!');
        },
         complete: () => {
          this.populaMasterys()
          this.spinner.hide();
        }
      });
    }
  }

  GetAccountInformations(){
    if(this.puuid != ""){
      this.accountService.getAccountInformations(this.puuid).subscribe({
        next: (_accountInformations: any) => {
          this.accountInformations = _accountInformations
        },
        error: (error:any) => {
          this.spinner.hide();
          console.log('Erro ao carregar as informações da conta','Erro!');
        },
         complete: () => {
          this.username = this.accountInformations.name;
          this.iconUrl = this.accountInformations.profileIconUrl;
          console.log(this.accountInformations);
          this.spinner.hide();
        }
      });
    }
  }

  GetRank(){
    if(this.puuid != ""){
      this.accountService.getRankByPiuuId(this.puuid).subscribe({
        next: (_rank:Rank[]) => {
          this.ranks = _rank
        },
        error: (error:any) => {
          this.spinner.hide();
          console.log('Erro ao carregar as Maestrias','Erro!');
        },
         complete: () => {
          this.populaRanks()
        }
      });
    }
  }

  populaMasterys(){
    for(let i = 0; i < 3; i++){
      this.masterys.push(this.mastery[i]);
    }

    this.championName1 = this.mastery[0].champName ?? "";
    this.championName2 = this.mastery[1].champName ?? "";
    this.championName3 = this.mastery[2].champName ?? "";
    this.urlChampion1 = this.mastery[0].champUrlImg ?? "";
    this.urlChampion2 = this.mastery[1].champUrlImg ?? "";
    this.urlChampion3 = this.mastery[2].champUrlImg ?? "";
    this.championPoints1 = this.formatarNumero(this.mastery[0].championPoints ?? "")
    this.championPoints2 = this.formatarNumero(this.mastery[1].championPoints ?? "")
    this.championPoints3 = this.formatarNumero(this.mastery[2].championPoints ?? "")
  }

  populaRanks(){
    this.ranks.forEach((rank: Rank )=>{
      if(rank.queueType == QueueTypeEnum.Solo)
        this.rankSolo = rank;
      else if(rank.queueType == QueueTypeEnum.Flex)
        this.rankFlex = rank;
    });

    this.mudaImagemRank();
  }

  mudaImagemRank() {
    
    this.verificaImagemRankSolo(this.rankSolo);
    this.verificaImagemRankFlex(this.rankFlex);

    if(!this.rankSolo.leagueId)
      this.mudaImagemParaProvisional(this.rankSolo) 
    
    if(!this.rankFlex.leagueId)
      this.mudaImagemParaProvisional(this.rankSolo) 
  }


  mudaImagemParaProvisional(rank: Rank) {
    if(!this.rankSolo.leagueId)
      this.urlImgRankSolo = rankIconMap['PROVISIONAL'] || '';

      if(!this.rankFlex.leagueId)
      this.urlImgRankFlex = rankIconMap['PROVISIONAL'] || '';
  }
  
  verificaImagemRankSolo(rank: Rank) {
    let tier = (rank.tier + rank.rank)

    switch (tier) {
      case RankEnum.BRONZE_I:
        this.urlImgRankSolo = rankIconMap['BRONZEI'] || '';
        break;
      case RankEnum.BRONZE_II:
        this.urlImgRankSolo = rankIconMap['BRONZEII'] || '';
        break;
      case RankEnum.BRONZE_III:
        this.urlImgRankSolo = rankIconMap['BRONZEIII'] || '';
        break;
      case RankEnum.BRONZE_IV:
        this.urlImgRankSolo = rankIconMap['BRONZEIV'] || '';
        break;
      case RankEnum.BRONZE_V:
        this.urlImgRankSolo = rankIconMap['BRONZEV'] || '';
        break;
      case RankEnum.SILVER_I:
        this.urlImgRankSolo = rankIconMap['SILVERI'] || '';
        break;
      case RankEnum.SILVER_II:
        this.urlImgRankSolo = rankIconMap['SILVERII'] || '';
        break;
      case RankEnum.SILVER_III:
        this.urlImgRankSolo = rankIconMap['SILVERIII'] || '';
        break;
      case RankEnum.SILVER_IV:
        this.urlImgRankSolo = rankIconMap['SILVERIV'] || '';
        break;
      case RankEnum.SILVER_V:
        this.urlImgRankSolo = rankIconMap['SILVERV'] || '';
        break;
      case RankEnum.GOLD_I:
        this.urlImgRankSolo = rankIconMap['GOLDI'] || '';
        break;
      case RankEnum.GOLD_II:
        this.urlImgRankSolo = rankIconMap['GOLDII'] || '';
        break;
      case RankEnum.GOLD_III:
        this.urlImgRankSolo = rankIconMap['GOLDIII'] || '';
        break;
      case RankEnum.GOLD_IV:
        this.urlImgRankSolo = rankIconMap['GOLDIV'] || '';
        break;
      case RankEnum.GOLD_V:
        this.urlImgRankSolo = rankIconMap['GOLDV'] || '';
        break;
      case RankEnum.PLATINUM_I:
        this.urlImgRankSolo = rankIconMap['PLATINUMI'] || '';
        break;
      case RankEnum.PLATINUM_II:
        this.urlImgRankSolo = rankIconMap['PLATINUMII'] || '';
        break;
      case RankEnum.PLATINUM_III:
        this.urlImgRankSolo = rankIconMap['PLATINUMIII'] || '';
        break;
      case RankEnum.PLATINUM_IV:
        this.urlImgRankSolo = rankIconMap['PLATINUMIV'] || '';
        break;
      case RankEnum.PLATINUM_V:
        this.urlImgRankSolo = rankIconMap['PLATINUMV'] || '';
        break;
      case RankEnum.DIAMOND_I:
        this.urlImgRankSolo = rankIconMap['DIAMONDI'] || '';
        break;
      case RankEnum.DIAMOND_II:
        this.urlImgRankSolo = rankIconMap['DIAMONDII'] || '';
        break;
      case RankEnum.DIAMOND_III:
        this.urlImgRankSolo = rankIconMap['DIAMONDIII'] || '';
        break;
      case RankEnum.DIAMOND_IV:
        this.urlImgRankSolo = rankIconMap['DIAMONDIV'] || '';
        break;
      case RankEnum.DIAMOND_V:
        this.urlImgRankSolo = rankIconMap['DIAMONDV'] || '';
        break;
      case RankEnum.EMERALD_I:
        this.urlImgRankSolo = rankIconMap['EMERALDI'] || '';
        break;
      case RankEnum.EMERALD_II:
        this.urlImgRankSolo = rankIconMap['EMERALDII'] || '';
        break;
      case RankEnum.EMERALD_III:
        this.urlImgRankSolo = rankIconMap['EMERALDIII'] || '';
        break;
      case RankEnum.EMERALD_IV:
        this.urlImgRankSolo = rankIconMap['EMERALDIV'] || '';
        break;
      case RankEnum.EMERALD_V:
        this.urlImgRankSolo = rankIconMap['EMERALDV'] || '';
        break;
      case RankEnum.MASTERI:
        this.urlImgRankSolo = rankIconMap['MASTERI'] || '';
        break;
      case RankEnum.CHALLENGERI:
        this.urlImgRankSolo = rankIconMap['CHALLENGERI'] || '';
        break;
      default:
        this.urlImgRankSolo = '';
        break;
    }
    
  }

  verificaImagemRankFlex(rank: Rank) {
    let tier = (rank.tier + rank.rank)

    switch (tier) {
      case RankEnum.BRONZE_I:
        this.urlImgRankFlex = rankIconMap['BRONZEI'] || '';
        break;
      case RankEnum.BRONZE_II:
        this.urlImgRankFlex = rankIconMap['BRONZEII'] || '';
        break;
      case RankEnum.BRONZE_III:
        this.urlImgRankFlex = rankIconMap['BRONZEIII'] || '';
        break;
      case RankEnum.BRONZE_IV:
        this.urlImgRankFlex = rankIconMap['BRONZEIV'] || '';
        break;
      case RankEnum.BRONZE_V:
        this.urlImgRankFlex = rankIconMap['BRONZEV'] || '';
        break;
      case RankEnum.SILVER_I:
        this.urlImgRankFlex = rankIconMap['SILVERI'] || '';
        break;
      case RankEnum.SILVER_II:
        this.urlImgRankFlex = rankIconMap['SILVERII'] || '';
        break;
      case RankEnum.SILVER_III:
        this.urlImgRankFlex = rankIconMap['SILVERIII'] || '';
        break;
      case RankEnum.SILVER_IV:
        this.urlImgRankFlex = rankIconMap['SILVERIV'] || '';
        break;
      case RankEnum.SILVER_V:
        this.urlImgRankFlex = rankIconMap['SILVERV'] || '';
        break;
      case RankEnum.GOLD_I:
        this.urlImgRankFlex = rankIconMap['GOLDI'] || '';
        break;
      case RankEnum.GOLD_II:
        this.urlImgRankFlex = rankIconMap['GOLDII'] || '';
        break;
      case RankEnum.GOLD_III:
        this.urlImgRankFlex = rankIconMap['GOLDIII'] || '';
        break;
      case RankEnum.GOLD_IV:
        this.urlImgRankFlex = rankIconMap['GOLDIV'] || '';
        break;
      case RankEnum.GOLD_V:
        this.urlImgRankFlex = rankIconMap['GOLDV'] || '';
        break;
      case RankEnum.PLATINUM_I:
        this.urlImgRankFlex = rankIconMap['PLATINUMI'] || '';
        break;
      case RankEnum.PLATINUM_II:
        this.urlImgRankFlex = rankIconMap['PLATINUMII'] || '';
        break;
      case RankEnum.PLATINUM_III:
        this.urlImgRankFlex = rankIconMap['PLATINUMIII'] || '';
        break;
      case RankEnum.PLATINUM_IV:
        this.urlImgRankFlex = rankIconMap['PLATINUMIV'] || '';
        break;
      case RankEnum.PLATINUM_V:
        this.urlImgRankFlex = rankIconMap['PLATINUMV'] || '';
        break;
      case RankEnum.DIAMOND_I:
        this.urlImgRankFlex = rankIconMap['DIAMONDI'] || '';
        break;
      case RankEnum.DIAMOND_II:
        this.urlImgRankFlex = rankIconMap['DIAMONDII'] || '';
        break;
      case RankEnum.DIAMOND_III:
        this.urlImgRankFlex = rankIconMap['DIAMONDIII'] || '';
        break;
      case RankEnum.DIAMOND_IV:
        this.urlImgRankFlex = rankIconMap['DIAMONDIV'] || '';
        break;
      case RankEnum.DIAMOND_V:
        this.urlImgRankFlex = rankIconMap['DIAMONDV'] || '';
        break;
      case RankEnum.EMERALD_I:
        this.urlImgRankFlex = rankIconMap['EMERALDI'] || '';
        break;
      case RankEnum.EMERALD_II:
        this.urlImgRankFlex = rankIconMap['EMERALDII'] || '';
        break;
      case RankEnum.EMERALD_III:
        this.urlImgRankFlex = rankIconMap['EMERALDIII'] || '';
        break;
      case RankEnum.EMERALD_IV:
        this.urlImgRankFlex = rankIconMap['EMERALDIV'] || '';
        break;
      case RankEnum.EMERALD_V:
        this.urlImgRankFlex = rankIconMap['EMERALDV'] || '';
        break;
      case RankEnum.MASTERI:
        this.urlImgRankFlex = rankIconMap['MASTERI'] || '';
        break;
      case RankEnum.CHALLENGERI:
        this.urlImgRankFlex = rankIconMap['CHALLENGERI'] || '';
        break;
      default:
        this.urlImgRankFlex = '';
        break;
    }
    
  }

  formatarNumero(points: string): string {

    if(points == "")
      return points;

    let numero = parseInt(points);

    if (numero < 1000) {
        return numero.toString();
    } else if (numero < 1000000) {
        return (numero / 1000).toFixed(1).replace(/\.?0*$/, '') + ' k';
    } else {
        return (numero / 1000000).toFixed(3).replace(/\.?0*$/, '') + ' kk';
    }
  }
}
