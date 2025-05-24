import { Component, provideAppInitializer } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


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
  { id: 'hi ', name: 'भारतीय', flagUrl: 'https://flagcdn.com/w20/in.png' },
  { id: 'pl', name: 'Polski', flagUrl: 'https://flagcdn.com/w20/pl.png' },
  { id: 'ar', name: 'عربي', flagUrl: 'https://flagcdn.com/w20/sa.png' },
  { id: 'zh-cn', name: '中國人', flagUrl: 'https://flagcdn.com/w20/cn.png' },
];

@Component({
  selector: 'app-homepage',
  imports: [RouterOutlet, RouterLink,FooterComponent,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})


export class HomepageComponent {
  cities: any[] = [];
  citys:any[]=[];
  hotels:any[]=[];
  today: string='';
  searchQuery: string = '';
  countries: { name: string; _id: string }[] = [];// Array per la dropdown
  submitted: boolean = false;
  baseUrlNew:string = "http://thinktravel.ddns.net:8000";
  isMobileMenuOpen = false;
  isDropdownOpen = false;

  languages = LANGUAGES;
  selectedLanguage: Language = this.languages[0]; // Imposta 'English' come predefinito
  isOpen = false;

constructor( private functionApi: FunzioniApiService,private router: Router,private cdr: ChangeDetectorRef ) {
  const savedLangId = localStorage.getItem('lang');
    const langFromStorage = this.languages.find(lang => lang.id === savedLangId);
    this.selectedLanguage = langFromStorage || this.languages[0]; 
  }
async ngOnInit() {
localStorage.setItem("country_id","");

  const now = new Date();
  this.today = now.toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
  console.log(this.citys);
console.log(this.cities);

try {
  // Ottieni i paesi tramite il servizio
  this.countries = await this.functionApi.getCountriesNew();
  console.log(this.countries);
  
} catch (error) {
  console.error('Errore durante il recupero dei paesi:', error);
}

// nuvoo prendi 5 citta random

const rndCities = await this.functionApi.getRandomCities(5);
console.log("città random: ", rndCities);
this.citys = await Promise.all(rndCities.map(async (citta: any) => {
  // console.log('CITTA :', citta.id);
   try {
     const imageNames = await this.functionApi.getImgCity(citta.id);
 console.log(imageNames)
     const imageUrl = imageNames.length > 0
       ? this.baseUrlNew+`/images/cities/${imageNames[0]}`
       : '';
 
     return {
       ...citta,
       photoUrl: imageUrl
     };
   } catch (error) {
     console.error(`Errore nel recupero immagine per ${citta.name}:`, error);
     return {
       ...citta,
       photoUrl: ''
     };
   }
 }));

//random hotel
const rndHotel = await this.functionApi.getRandomHotel(5);
console.log("Hotel suggeriti:", rndHotel);
this.hotels = await Promise.all(
  rndHotel.map(async (hotel: any) => {
    try {
      console.log(`Hotel: ${hotel.name}, ID: ${hotel.id}`);

      const imageNames = await this.functionApi.getImgHotel(hotel.id);
      console.log(`Immagini per ${hotel.name}:`, imageNames);

      const imageUrl = imageNames.length > 0
        ? this.baseUrlNew + `/images/hotels/${imageNames[0]}`
        : 'assets/img/hotel-placeholder.jpg';  // Placeholder di default

      console.log(`URL immagine per ${hotel.name}:`, imageUrl);

      return {
        ...hotel,
        photoUrl: imageUrl
      };

    } catch (error) {
      console.error(`Errore nel recupero immagine hotel per ${hotel.name}:`, error);
      return {
        ...hotel,
        photoUrl: 'assets/img/hotel-placeholder.jpg'  // Fallback anche in caso di errore
      };
    }
  })
);
}
/*----------*/

//------------------------

search() {
  if (this.searchQuery.trim().length === 0) {
    this.submitted = true;
    console.log("Devi inserire almeno un carattere");
    return;
  }

  // Salva il valore della città nel localStorage
  localStorage.setItem('searchCity', this.searchQuery.trim());
  // Naviga alla pagina "searchDest"
  this.router.navigate(['/searchDest']);
}


  // Metodi per il language selector
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.dropdownOpen = !this.dropdownOpen;}
    selectLanguage(lang: Language): void {
      this.selectedLanguage = lang;
      this.isOpen = false;
      console.log('Lingua selezionata:', lang.id);
      localStorage.setItem("lang",lang.id);
      console.log(localStorage.getItem("lang"));
      window.location.reload();

      // Qui puoi aggiungere la logica per cambiare lingua nell'app
    }
    dropdownOpen = false;
selectedCountry: any = null;

    selectCountry(country: any) {
      this.selectedCountry = country;
      console.log(this.selectedCountry)
      localStorage.setItem("country_id",this.selectedCountry.id);
      console.log(localStorage.getItem("country_id"));
      this.loadRandomCities()
    
}
async loadRandomCities() {
  console.log("Funzione chiamata")
  try {
    // Prendi l'id della nazione selezionata oppure null
    const nationId = this.selectedCountry ? this.selectedCountry.id : null;

    // Passa nationId solo se esiste
    const random = nationId
      ? await this.functionApi.getRandomCities(5, nationId)
      : await this.functionApi.getRandomCities(5);

    console.log("Città random:", random);

    // Ottieni immagini e costruisci oggetti città con foto
    this.citys = await Promise.all(
      random.map(async (citta: any) => {
        try {
          const imageNames = await this.functionApi.getImgCity(citta.id);
          const imageUrl = imageNames.length > 0
            ? this.baseUrlNew + `/images/cities/${imageNames[0]}`
            : '';

          return {
            ...citta,
            photoUrl: imageUrl
          };
        } catch (error) {
          console.error(`Errore nel recupero immagine per ${citta.name}:`, error);
          return {
            ...citta,
            photoUrl: ''
          };
        }
      })
    );
    this.citys = [...this.citys]; 
    this.dropdownOpen = false;
    this.cdr.detectChanges();
  } catch (error) {
    console.error("Errore nel caricamento delle città random:", error);
  }
}

}



