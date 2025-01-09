import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinosaurComponent } from './dinosaur.component';

describe('DinosaurComponent', () => {
  let component: DinosaurComponent;
  let fixture: ComponentFixture<DinosaurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinosaurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinosaurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
