import { Component,ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink,UserProfileComponent,NgbModule,CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  user: any = { name: 'Nome Utente', email: 'utente@email.com', image: '' };
   userData:any;

  async ngOnInit() {
  const userDataString = localStorage.getItem('userData'); // Recupera i dati salvati
  console.log(userDataString);
  if (userDataString) {
    this.userData = JSON.parse(userDataString); // Converte in oggetto
  }
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
