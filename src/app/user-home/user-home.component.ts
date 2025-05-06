import { Component,ViewChild } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import {  OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-user-home',
  imports: [RouterOutlet, RouterLink,FooterComponent,ReactiveFormsModule,FormsModule,CommonModule,NgbModule,SideBarComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent{
  userName: string | null = ''; // Per salvare il nome dell'utente
  searchQuery: string = '';
  submitted: boolean = false;
  cities: any[] = [];

  @ViewChild('profileSidebar') profileSidebar!: SideBarComponent;
  isCollapsed = true;
  private tokenCheckInterval: any;

  constructor(private fb: FormBuilder,private router: Router,private funzioniApiService:FunzioniApiService) {  }

  async ngOnInit() {
    console.log(localStorage.getItem("type"))

    const userDataString = localStorage.getItem('userData'); // Recupera i dati salvati --> posso poi toglierlo

    const provaMeData=await this.funzioniApiService.getUserData();//recupero dati utente
    console.log("prova me: "+provaMeData.name);
    
    if (provaMeData) {
      //const userData = JSON.parse(userDataString); // Converte in oggetto
      this.userName = provaMeData.name; // Estrae il campo "name"
    }
    try {

      const responseQuattro=await this.funzioniApiService.getFiveCities(4);
  // Mappatura delle liste ricevute dal server

  this.cities = this.mapCities(responseQuattro); // Per "Most Recommended"

  console.log('Most Recommended:', this.cities);
  } catch (error) {
    console.error('Errore durante il recupero delle città:', error);
    }
  console.log(this.cities);
  }
  // Metodo per mappare le città e gestire il Base64
private mapCities(cities: any[]): any[] {
  return cities.map((city: any) => {
    if (city.photos && city.photos.length > 0) {
      let firstPhotoBase64 = city.photos[0];

      // Controlla e rimuove eventuali prefissi se presenti
      if (typeof firstPhotoBase64 === 'string' && firstPhotoBase64.startsWith('data:')) {
        const base64Index = firstPhotoBase64.indexOf('base64,') + 'base64,'.length;
        firstPhotoBase64 = firstPhotoBase64.substring(base64Index);
      } if (city.photos && city.photos.length > 0) {
        let firstPhotoBase64 = city.photos[0];

        return {
          ...city,
          photoUrl: `data:image/jpeg;base64,${firstPhotoBase64}` // Usa solo la prima immagine
        };
      } else {
        console.warn(`Nessuna foto disponibile per la città: ${city.name}`);
        return {
          ...city,
          photoUrl: '' // Foto vuota se non ci sono immagini disponibili
        };
      }
    } else {
      console.warn(`Nessuna foto disponibile per la città: ${city.name}`);
      return {
        ...city,
        photoUrl: '' // Foto vuota se non ci sono immagini disponibili
      };
    }
  });
}
  logout() {
    localStorage.removeItem('userData'); // Rimuove i dati dell'utente dalla localStorage
    console.log(localStorage.getItem("type"))
    const userData = localStorage.getItem('userData');
    if (!userData) {
      console.log("User data removed successfully!"); // Successo
    } else {
      console.log("Failed to remove user data."); // Fallimento
    }
    this.router.navigate(['/']); // Reindirizza l'utente alla pagina di login
  }

  search() {
    if (this.searchQuery.trim().length === 0) {
      this.submitted = true;
      console.log("Devi inserire almeno un carattere");
      return;
    }
    // Salva il valore della città nel localStorage
    localStorage.setItem('searchCity', this.searchQuery.trim());
    localStorage.setItem('type',"user");
    // Naviga alla pagina "searchDest"
    this.router.navigate(['/searchDest']);
  }
  explore(){
    localStorage.setItem('searchCity', this.searchQuery.trim());
    localStorage.setItem('type',"user");
    // Naviga alla pagina "searchDest"
    console.log(localStorage.getItem('type'))
    this.router.navigate(['/searchDest']);
  }

  //controllo token valido
  controlloToken(){
    this.funzioniApiService.ensureAuthenticated();
    
  }
//pulisce l'intervallo 
ngOnDestroy(): void {
  if (this.tokenCheckInterval) {
    clearInterval(this.tokenCheckInterval);
  }
}
}
