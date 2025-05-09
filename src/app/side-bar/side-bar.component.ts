import { Component,ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink,UserProfileComponent,NgbModule,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  user: any = { name: 'Nome Utente', email: 'utente@email.com', image: '' };
   userData:any;

constructor(private funzioniApiService:FunzioniApiService) {  }
  async ngOnInit() {

    //recupero dati utente 
  this.userData = await this.funzioniApiService.getUserData();
  console.log("dati utente side bar "+this.userData);

}

  openSidebar() {
    document.getElementById('profileSidebar')?.classList.add('show');
    document.querySelector('.overlay')?.classList.add('show');
  }

  closeSidebar() {
    document.getElementById('profileSidebar')?.classList.remove('show');
    document.querySelector('.overlay')?.classList.remove('show');
  }
  showProfile = false;

  openUserProfile():void {
    this.showProfile = true;
    document.body.style.overflow = 'hidden';
  }

  onProfileClosed():void {
    this.showProfile = false;
    document.body.style.overflow = '';
  }
}
