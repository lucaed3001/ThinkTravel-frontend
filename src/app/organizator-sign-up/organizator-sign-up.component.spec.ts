import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizatorSignUpComponent } from './organizator-sign-up.component';

describe('OrganizatorSignUpComponent', () => {
  let component: OrganizatorSignUpComponent;
  let fixture: ComponentFixture<OrganizatorSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizatorSignUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizatorSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
