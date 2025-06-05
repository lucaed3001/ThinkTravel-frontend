import { Component,OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink,RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';


interface Language {
  id: string;
  name: string;
  flagUrl: string;
}
const LANGUAGES: Language[] = [
  { id: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w20/gb.png' },
  { id: 'fr', name: 'Français', flagUrl: 'https://flagcdn.com/w20/fr.png' },
  { id: 'it', name: 'Italiano', flagUrl: 'https://flagcdn.com/w20/it.png' },
  { id: 'de', name: 'Deutsch', flagUrl: 'https://flagcdn.com/w20/de.png' },
  { id: 'es', name: 'Español', flagUrl: 'https://flagcdn.com/w20/es.png' },
  { id: 'hu', name: 'Magyar', flagUrl: 'https://flagcdn.com/w20/hu.png' },
  { id: 'nl', name: 'Nederlands', flagUrl: 'https://flagcdn.com/w20/nl.png' },
  { id: 'hi', name: 'भारतीय', flagUrl: 'https://flagcdn.com/w20/in.png' },
  { id: 'pl', name: 'Polski', flagUrl: 'https://flagcdn.com/w20/pl.png' },
  { id: 'ar', name: 'عربي', flagUrl: 'https://flagcdn.com/w20/sa.png' },
  { id: 'zh-cn', name: '中國人', flagUrl: 'https://flagcdn.com/w20/cn.png' },
];

@Component({
  selector: 'app-search-destination-homepage',
  imports: [FooterComponent,HomepageComponent,CommonModule,RouterLink,RouterOutlet,FormsModule,TranslateModule],
  templateUrl: './search-destination-homepage.component.html',
  styleUrl: './search-destination-homepage.component.css'
})


export class SearchDestinationHomepageComponent {
  selectedCityId: string | null = null;

  searchQuery: string = '';
  searchActive: boolean = false; // Variabile di stato per mostrare/nascondere i contenitori
  defaultCities: any[] = []; // Città di default (esplora destinazioni)
  searchResults: any[] = []; // Risultati della ricerca
  hotels: any[] = [];
  selectedCityName: string = '';
  selectedCityDescription: string = '';
  cityImages: string[] = [];
  selectedCityPhotoUrl: string = '';
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  isOpen = false;
  languages = LANGUAGES;
  selectedLanguage = LANGUAGES[0];

  
  urlDNS:string = "http://thinktravel.ddns.net:8000";
constructor( private functionApi: FunzioniApiService,private router: Router,private translate: TranslateService,private location: Location) { 
  const savedLangId = localStorage.getItem('lang');
    const langFromStorage = this.languages.find(lang => lang.id === savedLangId);
    this.selectedLanguage = langFromStorage || this.languages[0]; 

    this.translate.setDefaultLang(this.selectedLanguage.id.trim());
    this.translate.use(this.selectedLanguage.id.trim());
 }
async ngOnInit() {
  const city=localStorage.getItem('searchCity');

  this.searchQuery = city || "";

//nuovo cittò default


if(!this.searchQuery){
  try {
    const responseNew = await this.functionApi.getCityNew();
    console.log("Nuove città: ", responseNew);
  
    this.defaultCities = await Promise.all(responseNew.map(async (city: any) => {
     // console.log('CITY:', city);
      try {
        const imageNames = await this.functionApi.getImgCity(city.id);
    
        const imageUrl = imageNames.length > 0
          ? this.urlDNS+`/images/cities/${imageNames[0]}`
          : '';
    
        return {
          ...city,
          photoUrl: imageUrl
        };
      } catch (error) {
        console.error(`Errore nel recupero immagine per ${city.name}:`, error);
        return {
          ...city,
          photoUrl: ''
        };
      }
    }));
  
  } catch (error) {
    console.error('Errore durante il recupero delle città:', error);
  }
  
}else {
  this.searchDestination();
  localStorage.removeItem('searchCity');
  console.log("Rimosso searchCity dalla LocalStorage")
}
console.log("ciao "+this.defaultCities[1].name);

//-----------------------------
}

async searchDestination() {
    if (this.searchQuery.trim().length > 0) {
    this.searchActive = true;

  } 

  // Pulisce gli hotel e dettagli precedenti
  this.hotels = [];
  this.selectedCityName = '';
  this.selectedCityDescription = '';

  try {
    console.log('Effettuando ricerca per:', this.searchQuery);

    // Chiama la funzione del servizio per cercare città
    const response = await this.functionApi.searchAnnoucement(this.searchQuery);
    console.log('Risultati della ricerca:', response);

    this.searchResults = await Promise.all(response.map(async (city: any) => {
      try {
        const imageNames = await this.functionApi.getImgCity(city.id);
        const imageUrl = imageNames.length > 0
          ? this.urlDNS + `/images/cities/${imageNames[0]}`
          : '';
        return {
          ...city,
          photoUrl: imageUrl
        };
      } catch (error) {
        console.error(`Errore nel recupero immagine per ${city.name}:`, error);
        return {
          ...city,
          photoUrl: ''
        };
      }
    }));

    this.searchActive = true;
  } catch (error) {
    console.error('Errore durante la ricerca della città:', error);
  }
}

//con il click del plsante della card 
async searchDestinationClick(id: string, nome: string) {
  this.selectedCityId = id;
  this.searchQuery = nome;

  try {
    console.log('Effettuando ricerca hotel per:', this.searchQuery);
    const response = await this.functionApi.searchHotelCity(id);
    console.log('Risultati hotel:', response);

    // Pulisci i risultati città
    this.searchResults = [];

    // Trova la descrizione della città selezionata
    const city = [...this.defaultCities, ...this.searchResults].find(c => c.id === id);
    this.selectedCityName = nome;
    this.selectedCityDescription = city?.description || '';
    this.selectedCityPhotoUrl = city?.photoUrl || 'assets/default-city.jpg';
    

    this.hotels = await Promise.all(response.map(async (hotel: any) => {
      try {
        const imageNames = await this.functionApi.getImgHotel(hotel.id);
        const imageUrl = imageNames.length > 0
          ? this.urlDNS + `/images/hotels/${imageNames[0]}`
          : 'assets/default-hotel.jpg';
        return {
          ...hotel,
          photoUrl: imageUrl,
          description: hotel.description
        };
      } catch (error) {
        console.error(`Errore immagine hotel per ${hotel.name}:`, error);
        return {
          ...hotel,
          photoUrl: 'assets/default-hotel.jpg'
        };
      }
    }));

    this.searchActive = true;
  } catch (error) {
    console.error('Errore ricerca hotel:', error);
  }
}

async returnToHome()
{
  const typeUt=localStorage.getItem('type');
  console.log(typeUt);
  if(typeUt){
  if (typeUt === 'user') {
    console.log("Il valore di 'type' è 'user'.");
    // Esegui l'azione desiderata se il valore è 'user'
    this.router.navigate(['/homeUser']);
        // Rimuovi la chiave 'type' dal localStorage
    localStorage.removeItem('type');
    console.log("La chiave 'type' è stata rimossa dalla localStorage.");
  } else if(typeUt === 'org'){
    console.log("Il valore di 'type' non è 'user'.");
    // Esegui un'azione alternativa
    this.router.navigate(['/homeOrg']);
            // Rimuovi la chiave 'type' dal localStorage
            localStorage.removeItem('type');
            console.log("La chiave 'type' è stata rimossa dalla localStorage.");
  }

}else{
  this.router.navigate(['/']);
}


}
//va alla pag per prenotare
showAlertMap: { [key: string]: boolean } = {};
addPrenotation(nome:string,address:string,url:string,description:string):void{
  //console.log(nome)
  if(localStorage.getItem("userData")!=null){
    localStorage.setItem("hotelName",nome);
    localStorage.setItem("hotelAddress",address);
    localStorage.setItem("hotelUrl",url);
    localStorage.setItem("hotelDescription", description); 
    this.router.navigate(['/prenotazioni']);
  }
  else{
    this.showAlertMap[nome] = true;

    // Nascondi alert dopo 3 secondi (opzionale)
    setTimeout(() => {
      this.showAlertMap[nome] = false;
    }, 3000);
  }
}
closeAlert(hotelName: string): void {
  this.showAlertMap[hotelName] = false;
}
selectLanguage(lang: Language): void {
     
  this.selectedLanguage = lang;
  this.isOpen = false;
  console.log('Lingua selezionata:', lang.id);
  localStorage.setItem("lang",lang.id);
  console.log(localStorage.getItem("lang"));
  window.location.reload();


  // Qui puoi aggiungere la logica per cambiare lingua nell'app
}
goBack(): void {
  this.selectedCityId = null;
  this.searchActive = false;
  this.hotels = [];
  this.selectedCityName = '';
  this.selectedCityDescription = '';
  this.selectedCityPhotoUrl = '';
}

}
