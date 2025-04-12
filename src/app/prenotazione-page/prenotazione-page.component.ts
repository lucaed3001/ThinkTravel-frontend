import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-prenotazione-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './prenotazione-page.component.html',
  styleUrl: './prenotazione-page.component.css'
})
export class PrenotazionePageComponent implements OnInit {

  name=localStorage.getItem("hotelName");
  address=localStorage.getItem("hotelAddress");
  url=localStorage.getItem("hotelUrl");
  currentStep: number = 1;
  today: string = new Date().toISOString().split('T')[0];
  selectedRoom: any = null;
  selectedPayment: string = '';
  acceptTerms: boolean = false;

  hotel = {
    id: 'h123',
    name: 'Grand Hotel Mediterraneo',
    location: 'Firenze, Italia',
    rating: 4.5,
    mainImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rooms: [
      {
        id: 'r1',
        type: 'Camera Standard',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        price: 120,
        features: [
          { icon: 'fas fa-bed', text: '1 letto matrimoniale' },
          { icon: 'fas fa-ruler-combined', text: '25 m²' },
          { icon: 'fas fa-wifi', text: 'WiFi gratuito' },
          { icon: 'fas fa-snowflake', text: 'Aria condizionata' }
        ]
      },
      {
        id: 'r2',
        type: 'Camera Deluxe',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        price: 180,
        features: [
          { icon: 'fas fa-bed', text: '1 letto king size' },
          { icon: 'fas fa-ruler-combined', text: '35 m²' },
          { icon: 'fas fa-wifi', text: 'WiFi gratuito' },
          { icon: 'fas fa-snowflake', text: 'Aria condizionata' },
          { icon: 'fas fa-tv', text: 'TV a schermo piatto' },
          { icon: 'fas fa-coffee', text: 'Macchina del caffè' }
        ]
      },
      {
        id: 'r3',
        type: 'Suite Familiare',
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        price: 250,
        features: [
          { icon: 'fas fa-bed', text: '2 letti matrimoniali' },
          { icon: 'fas fa-ruler-combined', text: '50 m²' },
          { icon: 'fas fa-wifi', text: 'WiFi gratuito' },
          { icon: 'fas fa-snowflake', text: 'Aria condizionata' },
          { icon: 'fas fa-tv', text: '2 TV a schermo piatto' },
          { icon: 'fas fa-utensils', text: 'Angolo cottura' },
          { icon: 'fas fa-couch', text: 'Sala' }
        ]
      }
    ]
  };

  bookingData = {
    checkIn: '',
    checkOut: '',
    nights: 0,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
    taxes: 15,
    totalPrice: 0,
    bookingCode: ''
  };

  paymentMethods = [
    { id: 'creditCard', name: 'Carta di credito', icon: 'far fa-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal' },
    { id: 'bankTransfer', name: 'Bonifico bancario', icon: 'fas fa-university' }
  ];

  paymentData = {
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateBookingCode();
    console.log(this.name);
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('fas fa-star');
    }

    if (hasHalfStar) {
      stars.push('fas fa-star-half-alt');
    }

    while (stars.length < 5) {
      stars.push('far fa-star');
    }

    return stars;
  }

  selectRoom(room: any): void {
    this.selectedRoom = room;
    this.calculateTotal();
  }

  calculateNights(): void {
    if (this.bookingData.checkIn && this.bookingData.checkOut) {
      const checkInDate = new Date(this.bookingData.checkIn);
      const checkOutDate = new Date(this.bookingData.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      this.bookingData.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.calculateTotal();
    } else {
      this.bookingData.nights = 0;
      this.bookingData.totalPrice = 0;
    }
  }

  calculateTotal(): void {
    if (this.selectedRoom && this.bookingData.nights > 0) {
      this.bookingData.totalPrice = (this.selectedRoom.price * this.bookingData.nights) + this.bookingData.taxes;
    }
  }

  selectPayment(method: string): void {
    this.selectedPayment = method;
  }

  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
      
      // Genera un nuovo codice se siamo all'ultimo step
      if (this.currentStep === 4) {
        this.generateBookingCode();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  generateBookingCode(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.bookingData.bookingCode = result;
  }

  printConfirmation(): void {
    window.print();
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }
}
