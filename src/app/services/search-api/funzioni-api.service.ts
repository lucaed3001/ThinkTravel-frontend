import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FunzioniApiService {
  private baseUrl:string = "http://localhost:8000";
  private baseUrlNew:string = "http://thinktravel.ddns.net:8000";
  private urlCity = this.baseUrl + '/cities';

  private lang=localStorage.getItem("lang");

  constructor(private router:Router) {}

  async getCities(): Promise<
  {
    _id: string;
    name: string;
    country: {
      name: string;
      currency: string;
      flag: string;
      description: string;
    };
    description: string;
    language: { name: string; code: string };
    photos: string; // Base64 string
  }[]
> {
  try {
    console.log(this.urlCity);
    const response = await fetch(this.urlCity, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /*if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }*/

    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero delle città:', error);
    return [];
  }
}

//recupera città nuovo
async getCityNew(): Promise<any> {

  const token = localStorage.getItem('token');
console.log(token);
console.log(this.lang);
  try {
    const response = await fetch(this.baseUrlNew+'/locations/cities/?lang='+this.lang, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token non valido o errore nella richiesta');
    }

    const citta = await response.json();
    console.log(citta);
    return citta;

  } catch (error) {
    console.error('Errore nel recupero dati utente:', error);
    return null;
  }
}

//recupero immagine citta by id
async getImgCity(id:number): Promise<any> {
  const token = localStorage.getItem('token');
console.log(token);
  try {
    const response = await fetch(this.baseUrlNew+'/locations/cities/images/'+id, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token non valido o errore nella richiesta');
    }

    const img = await response.json();
    //console.log(img);
    return img;

  } catch (error) {
    console.error('Errore nel recupero dati utente:', error);
    return null;
  }
}


//recupero immagine citta by id
async getImgHotel(id:number): Promise<any> {
  const token = localStorage.getItem('token');
console.log(token);
  try {
    const response = await fetch(this.baseUrlNew+'/locations/hotels/images/'+id, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token non valido o errore nella richiesta');
    }

    const img = await response.json();
    //console.log(img);
    return img;

  } catch (error) {
    console.error('Errore nel recupero dati utente:', error);
    return null;
  }
}




async getFiveCities(c:number): Promise<
  {
    _id: string;
    name: string;
    country: {
      name: string;
      currency: string;
      flag: string;
      description: string;
    };
    description: string;
    language: { name: string; code: string };
    photos: string; // Base64 string
  }[]
> {
  try {
    console.log(this.urlCity+"/suggested?c=1");
    const response = await fetch(this.urlCity+"/suggested?c="+c, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /*if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }*/

    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero delle città:', error);
    return [];
  }
}
//random city nuovo
async getRandomCities(c:number): Promise<
  {
    _id: string;
    name: string;
    country: {
      name: string;
      id: string;
    };
    description: string;
  }[]
> {
  try {
    const response = await fetch(this.baseUrlNew+"/locations/cities/suggested/"+c+"?lang="+this.lang, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero delle città:', error);
    return [];
  }
}

//hotel random

async getRandomHotel(c:number): Promise<
  {
    id: number;
    name: string;
    address: string;
    city: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
      description: string;
    };
    description: string;
    graduation: number;
    organizer: {
      id: number;
      name: string;
      address: string;
      city: number;
      phone: string;
      email: string;
      vat: string;
      token: string;
    };
    star_number: number;
  }[]
> {
  try {
    const response = await fetch(this.baseUrlNew+"/locations/hotels/suggested/"+c+"?lang="+this.lang, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero degli hotel :', error);
    return [];
  }
}



async searchAnnoucement(s:string): Promise<any[]>{
  try {
    console.log(this.urlCity+"/suggested?c=1");
    const response = await fetch(this.baseUrlNew+'/locations/cities/?q='+s+'&lang='+this.lang, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /*if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }*/

    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero delle città:', error);
    return [];
  }
}
async searchHotelCity(id:string): Promise<any[]>{
  try {
    console.log(this.urlCity+"/suggested?c=1");
    const response = await fetch(this.baseUrlNew+'/locations/hotels/?lang='+this.lang+'&cid='+id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /*if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }*/

    return await response.json();
  } catch (error) {
    console.error('Errore nel recupero delle città:', error);
    return [];
  }
}


// PROVA PRENDERE MIEI DATI ---------------------
async getUserData(): Promise<any> {
  const token = localStorage.getItem('token');
console.log(token);
  try {
    const response = await fetch(this.baseUrlNew+'/auth/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token non valido o errore nella richiesta');
    }

    const userData = await response.json();
    console.log(userData);
    return userData;

  } catch (error) {
    console.error('Errore nel recupero dati utente:', error);
    return null;
  }
}

//prova per controllo token 
isTokenValid(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (err) {
    return false;
  }
}

ensureAuthenticated(): void {
  console.log("ciao");
  if (!this.isTokenValid()) {
    localStorage.removeItem('token');
    //localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
}
