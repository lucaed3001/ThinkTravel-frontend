//import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { OrganizatorSignUpComponent } from './organizator-sign-up/organizator-sign-up.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { OrganizatorHomeComponent } from './organizator-home/organizator-home.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { SearchDestinationHomepageComponent } from './search-destination-homepage/search-destination-homepage.component';
import { CreateHotelPageComponent } from './create-hotel-page/create-hotel-page.component';
import { UserExploreComponent } from './user-explore/user-explore.component';
import { HotelPageComponent } from './hotel-page/hotel-page.component';
import { DestinationPageComponent } from './destination-page/destination-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PrenotazionePageComponent } from './prenotazione-page/prenotazione-page.component';
export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
},
{
  path:'login',
    component:UserLoginComponent,
},
{
  path:'userSignUp',
    component:UserSignUpComponent,
},
{
  path:'orgSignUp',
component:OrganizatorSignUpComponent,
},
{
  path:'homeUser',
component:UserHomeComponent,
},
{
  path:'homeOrg',
component:OrganizatorHomeComponent,
},
{
  path:'calendar',
component:CalendarPageComponent,
},
{
  path:'searchDest',
component:SearchDestinationHomepageComponent,
},
{
  path:'Addhotel',
component:CreateHotelPageComponent,
},
{
  path:'userExp',
component:UserExploreComponent,
},
{
  path:'hotelPage',
component:HotelPageComponent,
},
{
  path:'userProfile',
component:UserProfileComponent,
},
{
  path:'prenotazioni',
component:PrenotazionePageComponent,
},

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
