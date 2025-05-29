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

  //----------------------REGISTRAZIONE UTENTE
  async registerUser(
    email: string,
    password: string,
    country: string,
    name: string,
    surname: string
  ): Promise<boolean> {

    const countryAsNumber = parseInt(country);
    console.log(countryAsNumber)

     if (isNaN(countryAsNumber)) {
        console.error('Paese non valido:', country);
        return false;
    }
  const userData = { 
    "email":email,
    "password": password,
    "country": countryAsNumber,
    "name": name,
    "surname": surname };

console.log(JSON.stringify(userData))

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      console.log(userData)

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

      const dataUser = await response.json();

      if (response.status===200) {
        console.log('Registrazione riuscita:', dataUser);
        //localStorage.setItem('userData', JSON.stringify(responseJSON));
         if (dataUser.access_token) {
      localStorage.setItem('token', dataUser.token);
    }

    localStorage.setItem('userData', JSON.stringify(dataUser.user));

        return true;
      } else {
        throw new Error('Registrazione fallita');
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      return false;
    }
  }

//-----------------------------------REGISTRAZIONE ORGANIZZATORE 
  async registerOrg(
  email: string,
  password: string,
  country: string, // sarà mappato in city
  name: string,
  iva: string,     // sarà mappato in vat
  phone: string,
  address: string
): Promise<boolean> {

  const cityAsNumber = parseInt(country);

  if (isNaN(cityAsNumber)) {
    console.error('Paese non valido:', country);
    return false;
  }

  const orgData = {
    email: email,
    password: password,
    name: name,
    address: address,
    city: cityAsNumber,
    phone: phone,
    vat: iva
  };

  console.log(JSON.stringify(orgData));

  try {
    const response = await fetch(this.apiUrlOrg, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orgData),
    });

    if (!response.ok) {
      if (response.status === 409) {
        console.log('Organizzatore già registrato');
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

    const dataOrg = await response.json();

    if (response.status === 201) {
      console.log('Registrazione riuscita:', dataOrg);

      if (dataOrg.access_token) {
      localStorage.setItem('token', dataOrg.token);
      }

      localStorage.setItem('orgData', JSON.stringify(dataOrg));

      return true;
    } else {
      throw new Error('Registrazione fallita');
    }
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return false;
  }
}
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
