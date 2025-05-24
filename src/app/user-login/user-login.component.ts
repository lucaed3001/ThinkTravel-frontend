import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import {RouterOutlet, RouterLink} from '@angular/router';
import { Router } from '@angular/router';
import { LoginApiService } from '../services/login-api/login-api.service';

@Component({
  selector: 'app-user-login',
  imports: [ReactiveFormsModule,RouterOutlet, RouterLink],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,  private loginApiService: LoginApiService,private router: Router) {
    // Crea il form con controlli e validatori
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email obbligatoria e valida
      password: ['', Validators.required]                  // Password obbligatoria
    });
  }
  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        //const response = await this.loginApiService.login(email, password);
        //prova nuova api
        const response=await this.loginApiService.newLogin(email, password);

        if (response.success) {
          console.log("Login avvenuto con successo");
          if (response.userType === 'org') {
            this.router.navigate(['/homeOrg']); // Homepage per organizzatore
          } else if (response.userType === 'user') {
            this.router.navigate(['/homeUser']); // Homepage per utente
          }
        } else {
          alert("Login fallito");
        }
      } catch (error) {
        console.error('Errore durante il login:', error);
      }
    } else { 
      console.log('Il form non è valido');
    }
  }
  goBack(): void {
    window.history.back();
  }
  
}


