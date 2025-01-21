import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHotelPageComponent } from './create-hotel-page.component';

describe('CreateHotelPageComponent', () => {
  let component: CreateHotelPageComponent;
  let fixture: ComponentFixture<CreateHotelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHotelPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHotelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
