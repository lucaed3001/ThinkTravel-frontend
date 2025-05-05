import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private baseUrl:string = "http://localhost:8081";
  private baseUrlNew:string = "http://localhost:8000";

  private usrUrlNew=this.baseUrlNew+'/auth/user/login'
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
            /*if (data.token) {
              localStorage.setItem('token', data.token);
            }*/
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
        /*if (data.token) {
              localStorage.setItem('token', dataOrg.token);
            }*/
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
  ///////// prova---------------
  async testToken(email: string, password: string): Promise<{ success: boolean, userType?: string }> {
    const hashedPassword = crypto.SHA512(password).toString();

    //body
    const body = new URLSearchParams();
  body.append('grant_type', 'password');
  body.append('username', email);
  body.append('password', password);
  body.append('scope', '');
  body.append('client_id', '');
  body.append('client_secret', '');



    try {
      const responseUser = await fetch(this.usrUrlNew, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
  
      if (!responseUser.ok) {
        return { success: false };
      }
  
      const data = await responseUser.json();
  
      if (data.access_token) {
        localStorage.setItem('token', data.access_token); // Salva il token nel localStorage
        console.log(data.access_token)
      }
  
      // Decodifica e salva altre informazioni utente se necessario
      localStorage.setItem('userData', JSON.stringify(data.user));
  
      return { success: true, userType: 'user' };
  
    } catch (error) {
      console.error('Errore nel login:', error);
      return { success: false };
    }
  }

  
  }
