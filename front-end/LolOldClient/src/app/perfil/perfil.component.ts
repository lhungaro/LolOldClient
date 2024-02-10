import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Account } from '../models/account';
import { Mastery } from '../models/mastery';
import { Rank } from '../models/rank';
import { QueueTypeEnum } from '../helpers/queueTypeEnum';
import { RankEnum } from '../helpers/rankEnum';
import { ICON_PATHS, Tier, rankIconMap } from '../helpers/icons.config';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  username:string = "YODA#BR1";
  iconUrl:string = "https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/588.png"
  urlChampion1:string = ""
  urlChampion2:string = ""
  urlChampion3:string = ""
  championName1:string = ""
  championName2:string = ""
  championName3:string = ""
  urlImgRankSolo:string= "../../assets/tier-icons/tier-icons/diamond_i.png"
  urlImgRankTFT:string= "../../assets/tier-icons/tier-icons/diamond_i.png"
  urlImgRankFlex:string= "../../assets/tier-icons/tier-icons/diamond_i.png"
  elo:string = "Diamante I"
  pdls:string = "87 PDL"
  account!: Account;
  mastery!: Mastery[];
  masterys: Mastery[] = [];
  ranks: Rank[] = [];
  rankSolo: Rank = {
    queueType: '',
    tier: '',
    rank: '',
    leaguePoints: '',
  };
  rankFlex: Rank = {
    queueType: '',
    tier: '',
    rank: '',
    leaguePoints: '',
  };

  constructor(private accountService:AccountService) { }

  ngOnInit(){
    // this.GetUser();
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
            this.GetRank();
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

  GetRank(){
    if(this.account!= null){
      this.accountService.getRankByPiuuId(this.account.puuid).subscribe({
        next: (_rank:Rank[]) => {
          this.ranks = _rank
          console.log("Sucesso");
          console.log(this.ranks);
        },
        error: (error:any) => {
          // this.spinner.hide();
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

  populaRanks(){
    debugger
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

  isTier(value: string): value is Tier {
    return [
      'bronzeI', 'bronzeII', 'bronzeIII', 'bronzeIV', 'bronzeV',
      'silverI', 'silverII', 'silverIII', 'silverIV', 'silverV',
      'goldI', 'goldII', 'goldIII', 'goldIV', 'goldV',
      'platinumI', 'platinumII', 'platinumIII', 'platinumIV', 'platinumV',
      'diamondI', 'diamondII', 'diamondIII', 'diamondIV', 'diamondV'
    ].includes(value);
  }
}