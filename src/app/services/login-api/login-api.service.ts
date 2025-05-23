import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  private baseUrl:string = "http://localhost:8081";
  private baseUrlNew:string = "http://thinktravel.ddns.net:8000";

  private usrUrlNew=this.baseUrlNew+'/auth/user/login'
   private orgUrlNew=this.baseUrlNew+'/auth/org/login'
  private userUrl = this.baseUrl+'/user/login';
  private orgUrl = this.baseUrl+'/org/login';


  constructor() { }

  async newLogin(email: string, password: string): Promise<{ success: boolean, userType?: string }> {
    const hashedPassword = crypto.SHA512(password).toString();

  const orgBody = JSON.stringify({
    email,
    password: password,
  });

  try {
    // Tentativo login organizzatore
    const orgResponse = await fetch(this.orgUrlNew, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: orgBody,
    });

    if (orgResponse.ok) {
      const dataOrg = await orgResponse.json();
      localStorage.setItem('orgData', JSON.stringify(dataOrg.organizator));

      if (dataOrg.token) {
        localStorage.setItem('token', dataOrg.token);
      }

      return { success: true, userType: 'org' };
    } else {
      console.warn(`Login organizzatore fallito con status: ${orgResponse.status}`);
    }

    // In ogni caso, si tenta anche il login utente
    const userBody = new URLSearchParams();
    userBody.append('grant_type', 'password');
    userBody.append('username', email);
    userBody.append('password', password);
    userBody.append('scope', '');
    userBody.append('client_id', '');
    userBody.append('client_secret', '');

    const userResponse = await fetch(this.usrUrlNew, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: userBody.toString()
    });

    if (!userResponse.ok) {
      console.warn(`Login utente fallito con status: ${userResponse.status}`);
      return { success: false };
    }

    const dataUser = await userResponse.json();

    if (dataUser.access_token) {
      localStorage.setItem('token', dataUser.access_token);
    }

    localStorage.setItem('userData', JSON.stringify(dataUser.user));

    return { success: true, userType: 'user' };

  } catch (error) {
    console.error('Errore durante il login:', error);
    return { success: false };
  } 
  }
  
  }
