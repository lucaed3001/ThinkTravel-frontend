import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private baseUrl:string = "https://"+location.host.replace("4200", "8081");

  private userUrl = this.baseUrl+'/user/login';
  private orgUrl = this.baseUrl+'/org/login';


  constructor() { }
  async login(email: string, password: string): Promise<{ success: boolean, userType?: string }> {
    // Crittografia della password in SHA-512
    const hashedPassword = crypto.SHA512(password).toString();

    try {
      const orgResponse = await fetch(this.orgUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: hashedPassword,
        }),
      });

      if (!orgResponse.ok) {
        if(orgResponse.status===404){
        console.warn('Utente non trovato.');
        try {
          const responseUser = await fetch(this.userUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password: hashedPassword,
            }),
          });

          if (!responseUser.ok) {
            if(responseUser.status===404){
            console.warn('Utente non trovato.');
            return {success:false};
          } else if(responseUser.status===500){
            console.warn('Errore interno');
            return {success:false};
          }else if(responseUser.status===401){
            console.warn('Invalid password');
            return {success:false};
          }
          }
          const data = await responseUser.json();
          if (responseUser.status===200) {
            console.log('Dati utente:', data.user); // Logga i dati dell'utente se necessario
            localStorage.setItem('userData', JSON.stringify(data.user));
            return {success:true,userType:'user'};
          }else {
            console.error('Login fallito:');
            return {success:false};
          }
        } catch (error) {
          //console.error('Errore durante la richiesta di login:', error);
          return {success:false};
        }
        //return false;
      } else if(orgResponse.status===500){
        console.warn('Errore interno');
        return {success:false};
      }else if(orgResponse.status===401){
        console.warn('Invalid password');
        return {success:false};
      }
      }

      const dataOrg = await orgResponse.json();
      console.log(dataOrg)
      if (orgResponse.status===200) {
        console.log('Dati organizzatore:', dataOrg.organizator); // Logga i dati dell'utente se necessario
        localStorage.setItem('orgData', JSON.stringify(dataOrg.organizator));
        return {success:true,userType:'org'};
      }else {
        console.error('Login fallito:');
        return {success:false};
      }
    } catch (error) {
      //console.error('Errore durante la richiesta di login:', error);
      return {success:false};
    }
  }
}
