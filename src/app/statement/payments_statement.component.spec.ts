import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsStatementComponent } from './payments_statement.component';

describe('PaymentsStatementComponent', () => {
  let component: PaymentsStatementComponent;
  let fixture: ComponentFixture<PaymentsStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsStatementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaymentsStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
