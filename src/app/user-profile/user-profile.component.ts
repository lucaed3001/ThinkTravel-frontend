import { Component, Input, Output, EventEmitter, ViewChild, ElementRef   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';
@Component({
  selector: 'app-user-profile',
  imports: [RouterLink,CommonModule,FormsModule,NgbModule,CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  userData:any;
  country:any;
  userImg:any;

  private previousUserImgUrl: string | null = null;//---

constructor(private funzioniApiService:FunzioniApiService) {  }
/*
async ngOnInit() {
this.userData = await this.funzioniApiService.getUserData();
 // console.log("dati utente side bar "+this.userData.name);
  this.userImg=await this.funzioniApiService.getUserImg();
  //console.log(this.userImg);
  this.country= await this.funzioniApiService.getCountry(this.userData.country);
}*/
async ngOnInit() {
  this.userData = await this.funzioniApiService.getUserData();

const blob = await this.funzioniApiService.getUserImg();
  if (blob) {
    if (this.userImg) URL.revokeObjectURL(this.userImg);
    this.userImg = URL.createObjectURL(blob);
  }

console.log(this.userImg);
  this.country = await this.funzioniApiService.getCountry(this.userData.country);
}


  @Input() isVisible: boolean = true;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  activeTab: string = 'info';

  user = {
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario.rossi@example.com',
    phone: '+39 123 456 7890',
    birthDate: new Date(1990, 5, 15),
    country: 'Italia',
    joinDate: new Date(2020, 2, 10),
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    badges: [
      { type: 'gold', icon: 'fas fa-medal', text: 'Esploratore' },
      { type: 'silver', icon: 'fas fa-umbrella-beach', text: 'Spiaggia' },
      { type: 'bronze', icon: 'fas fa-mountain', text: 'Montagna' }
    ],
    preferences: [
      { icon: 'fas fa-umbrella-beach', text: 'Spiagge' },
      { icon: 'fas fa-utensils', text: 'Cucina locale' },
      { icon: 'fas fa-hiking', text: 'Trekking' },
      { icon: 'fas fa-camera', text: 'Fotografia' }
    ],
    trips: [
      {
        destination: 'Bali, Indonesia',
        startDate: new Date(2023, 6, 15),
        endDate: new Date(2023, 6, 30),
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        destination: 'Parigi, Francia',
        startDate: new Date(2023, 8, 10),
        endDate: new Date(2023, 8, 20),
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ],
    wishlist: [
      {
        destination: 'Tokyo, Giappone',
        image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        destination: 'New York, USA',
        image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      },
      {
        destination: 'Sydney, Australia',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      }
    ],
    settings: {
      promoEmails: true,
      tripNotifications: false
    }
  };

  closeProfile():void {
    this.closed.emit();
    //this.isVisible= false;
    
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
  onAvatarClick() {
    this.fileInput.nativeElement.click();
  }

/*
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    this.funzioniApiService.uploadUserImg(file).then(success => {
      if (success) {
        this.funzioniApiService.getUserImg().then(url => {
          if (url) {
              if (this.userImg) {
              URL.revokeObjectURL(this.userImg);
            }
            this.userImg = url;
          }
        });
      }
    });
  }
}
*/
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    this.funzioniApiService.uploadUserImg(file).then(success => {
      if (success) {
        this.funzioniApiService.getUserImg().then(blob => {
          if (blob) {
            if (this.userImg) {
              URL.revokeObjectURL(this.userImg);
            }

            let imageUrl = URL.createObjectURL(blob);
            this.userImg = imageUrl;
          }
        });
      }
    });
  }
}



}
