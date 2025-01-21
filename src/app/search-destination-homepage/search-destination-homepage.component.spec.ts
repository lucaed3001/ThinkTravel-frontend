import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDestinationHomepageComponent } from './search-destination-homepage.component';

describe('SearchDestinationHomepageComponent', () => {
  let component: SearchDestinationHomepageComponent;
  let fixture: ComponentFixture<SearchDestinationHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDestinationHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDestinationHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
