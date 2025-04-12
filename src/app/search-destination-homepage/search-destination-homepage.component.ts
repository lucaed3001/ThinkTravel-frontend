import { Component,OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink,RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-destination-homepage',
  imports: [FooterComponent,HomepageComponent,CommonModule,RouterLink,RouterOutlet,FormsModule],
  templateUrl: './search-destination-homepage.component.html',
  styleUrl: './search-destination-homepage.component.css'
})
export class SearchDestinationHomepageComponent {
  searchQuery: string = '';
  searchActive: boolean = false; // Variabile di stato per mostrare/nascondere i contenitori
  defaultCities: any[] = []; // Città di default (esplora destinazioni)
  searchResults: any[] = []; // Risultati della ricerca
constructor( private functionApi: FunzioniApiService,private router: Router) {  }
async ngOnInit() {
  const city=localStorage.getItem('searchCity');

  this.searchQuery = city || "";

  if(!this.searchQuery){
  try {
    const response = await this.functionApi.getCities();
    console.log('Città recuperate:', response);

    // Mappa le città con il controllo sul base64 e prendendo solo la prima immagine
    this.defaultCities = response.map((city: any) => {
      if (city.photos && city.photos.length > 0) {
        let firstPhotoBase64 = city.photos[0];

        // Controlla e rimuove eventuali prefissi se presenti
        if (typeof firstPhotoBase64 === 'string' && firstPhotoBase64.startsWith('data:')) {
          const base64Index = firstPhotoBase64.indexOf('base64,') + 'base64,'.length;
          firstPhotoBase64 = firstPhotoBase64.substring(base64Index);
        }

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
    });

  } catch (error) {
    console.error('Errore durante il recupero delle città:', error);
  }
}else {
  this.searchDestination();
  localStorage.removeItem('searchCity');
  console.log("Rimosso searchCity dalla LocalStorage")
}
}


async searchDestination() {
  if (!this.searchQuery) {
    console.warn('Inserire una destinazione per effettuare la ricerca.');
    return;
  }

  try {
    console.log('Effettuando ricerca per:', this.searchQuery);

    // Chiama la funzione del servizio per cercare città
    const response = await this.functionApi.searchAnnoucement(this.searchQuery);
    console.log('Risultati della ricerca:', response);

    // Aggiorna i risultati visualizzati
    this.searchResults = response.map((city: any) => {
      if (city.photos && city.photos.length > 0) {
        let firstPhotoBase64 = city.photos[0];

        // Controlla e rimuove eventuali prefissi se presenti
        if (typeof firstPhotoBase64 === 'string' && firstPhotoBase64.startsWith('data:')) {
          const base64Index = firstPhotoBase64.indexOf('base64,') + 'base64,'.length;
          firstPhotoBase64 = firstPhotoBase64.substring(base64Index);
        }

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
    });
    this.searchActive = true;
  } catch (error) {
    console.error('Errore durante la ricerca della città:', error);
  }
}//
async searchDestinationClick(nome:string) {
this.searchQuery=nome;

  try {
    console.log('Effettuando ricerca per:', this.searchQuery);

    // Chiama la funzione del servizio per cercare città
    const response = await this.functionApi.searchAnnoucement(nome);
    console.log('Risultati della ricerca:', response);

    // Aggiorna i risultati visualizzati
    this.searchResults = response.map((city: any) => {
      if (city.photos && city.photos.length > 0) {
        let firstPhotoBase64 = city.photos[0];

        // Controlla e rimuove eventuali prefissi se presenti
        if (typeof firstPhotoBase64 === 'string' && firstPhotoBase64.startsWith('data:')) {
          const base64Index = firstPhotoBase64.indexOf('base64,') + 'base64,'.length;
          firstPhotoBase64 = firstPhotoBase64.substring(base64Index);
        }

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
    });
    this.searchActive = true;
  } catch (error) {
    console.error('Errore durante la ricerca della città:', error);
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

addPrenotation(nome:string,address:string,url:string):void{
  //console.log(nome)
  if(localStorage.getItem("userData")!=null){
    localStorage.setItem("hotelName",nome);
    localStorage.setItem("hotelAddress",address);
    localStorage.setItem("hotelUrl",url);
    this.router.navigate(['/prenotazioni']);
  }
  else{
    alert("You have to login to book a hotel");
  }
}

}
