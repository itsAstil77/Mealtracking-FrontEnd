import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrasroleComponent } from './extrasrole.component';

describe('ExtrasroleComponent', () => {
  let component: ExtrasroleComponent;
  let fixture: ComponentFixture<ExtrasroleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtrasroleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtrasroleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
