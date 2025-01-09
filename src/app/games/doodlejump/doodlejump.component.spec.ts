import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoodlejumpComponent } from './doodlejump.component';

describe('DoodlejumpComponent', () => {
  let component: DoodlejumpComponent;
  let fixture: ComponentFixture<DoodlejumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoodlejumpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoodlejumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
