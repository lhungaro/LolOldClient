import { Component, ElementRef, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Account } from '../models/account';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('screenVideo') screenVideo!: ElementRef;

  account: any;
  isMuted = false;
  shouldGoToLastSecond = false;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  puuid: string = '';
  username: string= "";
  tag: string = "";
  fullUsername : any;
  login =true;
  // videoUrl = 'https://www.youtube.com/watch?v=qbMCmdSEoaA';
  videoUrl = 'assets/screenVideo.mp4';

  verificaSeEstaHbilitado(){
    let isEnabled = this.username != "" && this.username != null
    && this.tag != "" && this.tag != null;

    if(!this.tag.includes("#")){
      this.tag = "#" + this.tag;
    }

    this.fullUsername = this.username + this.tag
    
    return isEnabled;
  }

  ngAfterViewInit(): void {
    this.iniciarReproducao();
  }

  iniciarReproducao(): void {
    const video = this.screenVideo.nativeElement as HTMLVideoElement;
    video.play();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  onTimeUpdate(event: any) {
    const video = this.screenVideo.nativeElement as HTMLVideoElement;
    if (this.shouldGoToLastSecond && video.currentTime < video.duration - 1) {
      video.currentTime = video.duration - 12;
      video.pause();
      this.shouldGoToLastSecond = false; // Reset the checkbox
    }
  }

  onGoToLastSecondChange() {
    const video = this.screenVideo.nativeElement as HTMLVideoElement;
    if (this.shouldGoToLastSecond) {
      video.currentTime = video.duration - 12;
      video.pause();
    } else {
      video.currentTime = 0;
      video.play();
    }
  }

  GetUser() {
    this.spinner.show();
    if (this.fullUsername != null) {
      this.accountService.getIdAccountByNameBr(this.fullUsername).subscribe({
        next: (_account: Account) => {
          this.account = _account;
        },
        error: (error: any) => {
          this.spinner.hide();
          console.log('Erro ao carregar o Usuário', 'Erro!');
        },
        complete: () => {
          this.puuid = this.account.puuid;
          this.spinner.hide();
          if (this.account != null) {
            this.login = false;
            console.log(this.account);
            
            this.username = this.account.gameName;
            this.router.navigate(['/perfil'], { queryParams: { puuid: this.puuid } })
          }
        },
      });
    }
  }
}
