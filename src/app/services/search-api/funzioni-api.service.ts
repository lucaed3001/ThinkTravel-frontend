import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunzioniApiService {
  private baseUrl:string = "http://localhost:8081";
  private urlCity = this.baseUrl + '/cities';

  constructor() {}

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


async searchAnnoucement(s:string): Promise<any[]>{
  try {
    console.log(this.urlCity+"/suggested?c=1");
    const response = await fetch(this.baseUrl+"/hotels/search?c="+s+"&p="+1, {
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
}
