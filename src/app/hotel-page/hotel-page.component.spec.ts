import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPageComponent } from './hotel-page.component';

describe('HotelPageComponent', () => {
  let component: HotelPageComponent;
  let fixture: ComponentFixture<HotelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
