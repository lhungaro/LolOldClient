import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
@Injectable()

export class AccountService{

  constructor(
    private http: HttpClient,
    private httpBackEnd: HttpBackend
    ) {}

  private baseUrl = 'https://localhost:7213/'

  public getIdAccountByNameBr(name: string){
    let parts = name.split('#');
    let tag = parts[1];
    let username = parts[0];
    var url = this.baseUrl + `GetAccount/${username}/${tag}`;
    
    return this.http.get<any>(url);
  }

  public getMaestriasByPiuuId(piuuid: string){
    var url = this.baseUrl + `GetMastery/${piuuid}`;
    
    return this.http.get<any>(url);
  }

  public getRankByPiuuId(piuuid: string){
    var url = this.baseUrl + `GetAccountRankByPiuuid/${piuuid}`;
    
    return this.http.get<any>(url);
  }

  public getChampions(){
    var url = this.baseUrl + `GetChampions`;
    
    return this.http.get<any>(url);
  }

  // public getMatchInformations(): Observable<any>{
  //   return this.http.get<any>('assets/matchInformationsMock.json');
  // }

  public getMatchInformations(piuuid:string): Observable<any>{
    var url = this.baseUrl + `GetMatchesInformations/${piuuid}`;
    return this.http.get<any>(url);

  }

  public getAccountInformations(piuuid:string): Observable<any>{
    var url = this.baseUrl + `GetAccountInformations/${piuuid}`;
    return this.http.get<any>(url);
  }

}

