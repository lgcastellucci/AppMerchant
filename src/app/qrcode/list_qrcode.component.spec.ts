import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListQrcodeComponent } from './list_qrcode.component';

describe('ListQrcodeComponent', () => {
  let component: ListQrcodeComponent;
  let fixture: ComponentFixture<ListQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListQrcodeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
