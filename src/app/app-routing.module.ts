import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { MenuComponent } from './options/menu.component';
import { CreateQrcodeComponent } from './qrcode/create_qrcode.component';
import { ListQrcodeComponent } from './qrcode/list_qrcode.component';
import { TransactionsStatementComponent } from './statement/transactions_statement.component';
import { PaymentsStatementComponent } from './statement/payments_statement.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'create_qrcode', component: CreateQrcodeComponent },
  { path: 'list_qrcode', component: ListQrcodeComponent },
  { path: 'transactions_statement', component: TransactionsStatementComponent },
  { path: 'payments_statement', component: PaymentsStatementComponent },

  // outras rotas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
