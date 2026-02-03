import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsStatementComponent } from './transactions_statement.component';

describe('TransactionsStatementComponent', () => {
  let component: TransactionsStatementComponent;
  let fixture: ComponentFixture<TransactionsStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsStatementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TransactionsStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
