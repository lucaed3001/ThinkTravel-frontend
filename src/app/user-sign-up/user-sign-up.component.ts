import { Component} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,FormBuilder } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { SignUpUserService } from '../services/signUpUser-api/sign-up-user.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-sign-up',
  imports: [RouterOutlet, RouterLink,ReactiveFormsModule,CommonModule],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {
  loginForm: FormGroup;

  countries: { name: string; _id: string }[] = [];// Array per la dropdown

  errorMessage = ''; // Per gestire errori
  successMessage = ''; // Per gestire successo
  // probabile variabile per capire tipo registrazione
  constructor(private fb: FormBuilder, private signUpUserService: SignUpUserService,private router: Router) {
    // Crea il form con controlli e validatori
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name:['', Validators.required],
      surname:['', Validators.required],
      country:['', Validators.required]
    });
  }
  //prende le country ---------------  DEVO CONTROLLARE
  async ngOnInit() {
    try {
      // Ottieni i paesi tramite il servizio
      this.countries = await this.signUpUserService.getCountries();
      console.log(this.countries);
      // imposto il primo paese come valore di default
      if (this.countries.length > 0) {
        this.loginForm.patchValue({
          country: this.countries[0]._id
        });
      }
    } catch (error) {
      console.error('Errore durante il recupero dei paesi:', error);
    }
  }
  //inizio prova registrazione user
  async onSubmit() {
    if (this.loginForm.valid) {
   try {
    const { email, password, name, surname, country } = this.loginForm.value; // ottengo i dati

      const hashedPassword = CryptoJS.SHA512(password).toString(); // crypto la password
        // Invia i dati al servizio di registrazione
        const success = await this.signUpUserService.registerUser(
          email,
          hashedPassword,
          country,
          name,
          surname
        );

        if (success) {
          this.successMessage = 'Registrazione completata con successo!';
          this.errorMessage = '';
          //this.loginForm.reset(); // Resetta il form
          this.router.navigate(['/homeUser']);
        } else {
          this.errorMessage = 'Registrazione fallita. Riprova.';
          this.successMessage = '';
        }
      } catch (error) {
        console.error('Errore durante la registrazione:', error);
        this.errorMessage = 'Si è verificato un errore durante la registrazione.';
        this.successMessage = '';
      }
    } else {
      console.log('Il form non è valido');
      this.errorMessage = 'Compila tutti i campi obbligatori.';
    }
  }
  }
