import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';

@Component({
  selector: 'app-payments_statement',
  templateUrl: './payments_statement.component.html',
  styles: ``
})

export class PaymentsStatementComponent {
  dataInicial: string = '';
  dataFinal: string = '';
  error: string = '';
  loading: boolean = false;
  payments: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  hasNextPage: boolean = false;
  constructor(private http: HttpClient, private router: Router) { }

  private formatDateToDDMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  }

  formatAmount(amount: number): string {
    if (amount == null) return '';
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onListPayments(page?: number) {

    this.loading = true; // Ativa o loading
    const token = localStorage.getItem('token');
    const merchantId = localStorage.getItem('merchantId');
    this.error = '';
    this.payments = [];

    if (page) this.pageNumber = page;

    const payload = {
      merchant_id: merchantId,
      start_date: this.formatDateToDDMMYYYY(this.dataInicial), // enviar DD.MM.YYYY
      end_date: this.formatDateToDDMMYYYY(this.dataFinal), // enviar DD.MM.YYYY
      page_number: this.pageNumber.toString(),
      page_size: this.pageSize.toString()
    };

    // Criando os headers
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post<any>(`${AppConstants.UrlBase}/statement/merchant/payments`, payload, { headers })
      .subscribe({
        next: (response) => {
          if (response && response.response_code == "00") {
            this.loading = false; // Desativa o loading

            // Mapeia os dados recebidos para o DTO formatado
            this.payments = (response.payments || []).map((t: any) => ({
              product: t.product,
              dueDate: t.due_date,
              createDate: t.due_date,
              paymentDate: t.payment_date,
              paymentId: t.payment_id,
              debits: parseInt(t.debits, 10) / 100,
              credits: parseInt(t.credits, 10) / 100,
              payments: parseInt(t.payments, 10) / 100,
              balance: parseInt(t.balance, 10) / 100,
              filter: t.filter
            })) as PaymentDto[];

            // Verifica se há próxima página
            this.hasNextPage = (response.transactions || []).length === this.pageSize;
          } else {
            this.loading = false; // Desativa o loading
            this.error = 'Erro ao consultar.';
            if (response && response.response_message != "") {
              this.error = response.response_message;
            }
          }
        },
        error: () => {
          this.loading = false; // Desativa o loading
          this.error = 'Erro ao consultar.';
        }
      });
  }

  onPreviousPage() {
    if (this.pageNumber > 1) {
      this.onListPayments(this.pageNumber - 1);
    }
  }

  onNextPage() {
    if (this.hasNextPage) {
      this.onListPayments(this.pageNumber + 1);
    }
  }

}

export interface PaymentDto {
  product: string;
  dueDate: string;
  createDate: string;
  paymentDate: string;
  paymentId: string;
  debits: number;
  credits: number;
  payments: number;
  balance: number;
  filter: string;
}
