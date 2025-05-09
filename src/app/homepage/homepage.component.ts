import { Component, provideAppInitializer } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-homepage',
  imports: [RouterOutlet, RouterLink,FooterComponent,CommonModule,FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent {
  cities: any[] = [];
  citys:any[]=[];
  today: string='';
  searchQuery: string = '';
  submitted: boolean = false;
  baseUrlNew:string = "http://thinktravel.ddns.net:8000";

constructor( private functionApi: FunzioniApiService,private router: Router) {  }
async ngOnInit() {
  
  const now = new Date();
  this.today = now.toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
  try {

   /* const responseCinque=await this.functionApi.getFiveCities(5);
    const responseQuattro=await this.functionApi.getFiveCities(4);

    console.log('5 Città recuperate:', responseCinque);
// Mappatura delle liste ricevute dal server
this.citys = this.mapCities(responseCinque); // Per "Popular Destinations"
this.cities = this.mapCities(responseQuattro); // Per "Most Recommended"
*/
console.log('Popular Destinations:', this.citys);
console.log('Most Recommended:', this.cities);
} catch (error) {
  console.error('Errore durante il recupero delle città:', error);
  }
  console.log(this.citys);
console.log(this.cities);



// nuvoo prendi 5 citta random

const responseNew = await this.functionApi.getRandomCities(5);
console.log("città random: ", responseNew);

this.citys = await Promise.all(responseNew.map(async (citta: any) => {
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
}
//------------------------
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
}



