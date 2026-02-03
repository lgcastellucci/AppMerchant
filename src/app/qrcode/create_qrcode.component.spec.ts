import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateQrcodeComponent } from './create_qrcode.component';

describe('CreateQrcodeComponent', () => {
  let component: CreateQrcodeComponent;
  let fixture: ComponentFixture<CreateQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQrcodeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
