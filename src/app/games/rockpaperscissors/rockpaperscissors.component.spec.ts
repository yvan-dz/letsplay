import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RockpaperscissorsComponent } from './rockpaperscissors.component';

describe('RockpaperscissorsComponent', () => {
  let component: RockpaperscissorsComponent;
  let fixture: ComponentFixture<RockpaperscissorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RockpaperscissorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RockpaperscissorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
