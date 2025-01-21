import { Component } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import {  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-organizator-home',
  imports: [RouterOutlet, RouterLink,FooterComponent],
  templateUrl: './organizator-home.component.html',
  styleUrl: './organizator-home.component.css'
})
export class OrganizatorHomeComponent{
  orgName: string | null = ''; // Per salvare il nome dell'utente
  constructor(private router: Router) {}
  ngOnInit() {
    const orgDataString = localStorage.getItem('orgData'); // Recupera i dati salvati
    if (orgDataString) {
      const orgData = JSON.parse(orgDataString); // Converte in oggetto
      console.log(orgData.name);
      this.orgName = orgData.name; // Estrae il campo "name"
    }
  }
  logout() {
    localStorage.removeItem('orgData'); // Rimuove i dati dell'utente dalla localStorage
    const orgData = localStorage.getItem('orgData');
    if (!orgData) {
      console.log("User data removed successfully!"); // Successo
    } else {
      console.log("Failed to remove user data."); // Fallimento
    }
    this.router.navigate(['/']); // Reindirizza l'utente alla pagina di login
  }
  explore(){

    localStorage.setItem('type',"org");
    // Naviga alla pagina "searchDest"
    this.router.navigate(['/searchDest']);
  }
}
