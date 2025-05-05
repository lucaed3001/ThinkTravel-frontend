import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignUpUserService {

  private baseUrl:string = "http://localhost:8081";

  private apiUrl = this.baseUrl+'/user/register';
  private apiUrlOrg = this.baseUrl+'/org/register';
  private countriesApiUrl = this.baseUrl+'/countries';

  constructor() { }

  async registerUser(
    email: string,
    password: string,
    country: string,
    name: string,
    surname: string
  ): Promise<boolean> {
    const userData = { email, password, country, name, surname };
console.log(JSON.stringify(userData))
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({//(userData),
        email,
        password,
        name,
        surname,
        country
        }),
      });

      if (!response.ok) {
         if(response.status==409){
          console.log('Utente già registrato');
          return false;
        }else if(response.status==500){
          console.log('Errore interno');
          return false;
        }
      }

      const responseJSON = await response.json();

      if (response.status==201) {
        console.log('Registrazione riuscita:', responseJSON);
        localStorage.setItem('userData', JSON.stringify(responseJSON));
        return true;
      } else {
        throw new Error('Registrazione fallita');
      }
    } catch (error) {
      //console.error('Errore durante la registrazione:', error);
      return false;
    }
  }

//-----------------------------------
  async registerOrg(
    email: string,
    password: string,
    country: string,
    name: string,
    iva: string,
    phone:string
  ): Promise<boolean> {
    const userData = { email, password, country, name, iva,phone };
console.log(JSON.stringify(userData))
    try {
      const response = await fetch(this.apiUrlOrg, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({//(userData),
        email,
        password,
        name,
        iva,
        country,
        phone
        }),
      });

      if (!response.ok) {
         if(response.status==409){
          console.log('Organizzatore già registrato');
          return false;
        }else if(response.status==500){
          console.log('Errore interno');
          return false;
        }
      }

      const responseJSON = await response.json();

      if (response.status==201) {
        console.log('Registrazione riuscita:', responseJSON);
        localStorage.setItem('orgData', JSON.stringify(responseJSON));
        return true;
      } else {
        throw new Error('Registrazione fallita');
      }
    } catch (error) {
      //console.error('Errore durante la registrazione:', error);
      return false;
    }
  }
   //-------------------------------------------


   async getCountries(): Promise<{ name: string; _id: string }[]> {
    try {
      console.log(this.countriesApiUrl)
      const response = await fetch(this.countriesApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Errore nel recupero dei paesi:', error);
      return [];
    }
  }

  //-------------------------------------------
  // get countriesNew
  async getCountriesNew(): Promise<any> {

    const token = localStorage.getItem('token');
  console.log(token);
    try {
      const response = await fetch('http://localhost:8000/locations/countries/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Token non valido o errore nella richiesta');
      }
  
      const countries = await response.json();
      console.log(countries);
      return countries;
  
    } catch (error) {
      console.error('Errore nel recupero dati utente:', error);
      return null;
    }
  }
}
