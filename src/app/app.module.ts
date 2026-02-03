import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { MenuComponent } from './options/menu.component';
import { CreateQrcodeComponent } from './qrcode/create_qrcode.component';
import { ListQrcodeComponent } from './qrcode/list_qrcode.component';
import { TransactionsStatementComponent } from './statement/transactions_statement.component';
import { PaymentsStatementComponent } from './statement/payments_statement.component';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    CreateQrcodeComponent,
    ListQrcodeComponent,
    TransactionsStatementComponent,
    PaymentsStatementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    QRCodeModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
