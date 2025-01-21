import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { FooterComponent } from './footer/footer.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { OrganizatorSignUpComponent } from './organizator-sign-up/organizator-sign-up.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { OrganizatorHomeComponent } from './organizator-home/organizator-home.component';
import { DestinationPageComponent } from './destination-page/destination-page.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { ThankYouPageComponent } from './thank-you-page/thank-you-page.component';
import { SearchDestinationHomepageComponent } from './search-destination-homepage/search-destination-homepage.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HomepageComponent,FooterComponent,UserLoginComponent,OrganizatorSignUpComponent,UserHomeComponent,UserSignUpComponent,OrganizatorHomeComponent,DestinationPageComponent,CalendarPageComponent,ThankYouPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
