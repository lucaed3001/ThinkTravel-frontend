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
   baseUrlNew:string = "http://thinktravel.ddns.net:8000";

  @ViewChild('profileSidebar') profileSidebar!: SideBarComponent;
  isCollapsed = true;
  private tokenCheckInterval: any;

  constructor(private fb: FormBuilder,private router: Router,private funzioniApiService:FunzioniApiService) {  }

  async ngOnInit() {
    const userData = await this.funzioniApiService.getUserData();
    this.userName = userData?.name || '';
    console.log("User country ID:", userData?.country);
  
    try {
      const nationId = userData?.country;
  
      // Passa nationId come secondo argomento
      const responseCities = await this.funzioniApiService.getRandomCities(5, nationId);
  
      // Per ogni città recupera l'immagine vera
      this.cities = await Promise.all(
        responseCities.map(async (citta: any) => {
          try {
            const imageNames = await this.funzioniApiService.getImgCity(citta.id);
            const imageUrl = (imageNames.length > 0)
              ? this.funzioniApiService.baseUrlNew + `/images/cities/${imageNames[0]}`
              : '';
  
            return {
              ...citta,
              photoUrl: imageUrl,
              description: citta.description || 'Nessuna descrizione disponibile',
              countryName: citta.country?.name || 'Nazione sconosciuta'
            };
          } catch (error) {
            console.error(`Errore nel recupero immagine per ${citta.name}:`, error);
            return {
              ...citta,
              photoUrl: '',
              description: citta.description || 'Nessuna descrizione disponibile',
              countryName: citta.country?.name || 'Nazione sconosciuta'
            };
          }
        })
      );
  
    } catch (error) {
      console.error('Errore durante il recupero delle città:', error);
    }
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
