import { Component,OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HomepageComponent } from '../homepage/homepage.component';
import { FunzioniApiService } from '../services/search-api/funzioni-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink,RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-explore',
  imports: [FooterComponent,HomepageComponent,CommonModule,RouterLink,RouterOutlet,FormsModule],
  templateUrl: './user-explore.component.html',
  styleUrl: './user-explore.component.css'
})
export class UserExploreComponent {
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
    console.log('Città vecchie recuperate:', response);
//prova nuovo getcity
    const responseNew= await this.functionApi.getCityNew();
    console.log("nuove città: ", responseNew);

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


}
