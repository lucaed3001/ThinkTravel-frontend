import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignUpUserService {

  private baseUrl:string = "http://thinktravel.ddns.net:8000";

  private apiUrl = this.baseUrl+'/auth/user/register';
  private apiUrlOrg = this.baseUrl+'/auth/org/register';
  private countriesApiUrl = this.baseUrl+'/locations/countries/names';

  constructor() { }

  async registerUser(
    email: string,
    password: string,
    country: string,
    name: string,
    surname: string
  ): Promise<boolean> {
    const countryAsNumber = parseInt(country);
  const userData = { 
    "email":email,
    "password": password,
    "country": countryAsNumber,
    "name": name,
    "surname": surname };

console.log(JSON.stringify(userData))

    try {
      const response = await fetch(this.apiUrl, {//this.apiUrl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
  if (response.status === 409) {
    console.log('Utente già registrato');
    return false;
  } else if (response.status === 422) {
    const errData = await response.json();
    console.error('Errore 422 - Dati non validi:', errData);
    return false;
  } else if (response.status === 500) {
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

  //-------------------------------------------
  // get countriesNew
  async getCountriesNew(): Promise<{ name: string; _id: string }[]> {

    try {
      const response = await fetch(this.countriesApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      console.log(response);
      const countries = await response.json();
      console.log(countries);
      return countries;
  
    }  catch (error) {
      console.error('Errore nel recupero dei paesi:', error);
      return [];
    }
  }
}
