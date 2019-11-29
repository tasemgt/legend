import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyBundlePage } from './buy-bundle.page';

describe('BuyBundlePage', () => {
  let component: BuyBundlePage;
  let fixture: ComponentFixture<BuyBundlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyBundlePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyBundlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
