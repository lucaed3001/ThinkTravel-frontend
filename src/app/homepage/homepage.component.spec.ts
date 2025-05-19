import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { HomepageComponent } from './homepage.component';



describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent,LanguageSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
