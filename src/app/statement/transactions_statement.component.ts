import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-transactions_statement',
  templateUrl: './transactions_statement.component.html',
  styleUrl: './transactions_statement.component.css'
})

export class TransactionsStatementComponent {
  dataInicial: string = '';
  dataFinal: string = '';
  error: string = '';
  transactions: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  hasNextPage: boolean = false;
  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  private formatDateToDDMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  }

  formatAmount(amount: number): string {
    if (amount == null) return '';
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  ngOnInit(): void {
    const hoje = new Date();

    if (this.dataInicial == '') {
      // Formata para YYYY-MM-DD
      const yyyy = hoje.getFullYear();
      const mm = String(hoje.getMonth() + 1).padStart(2, '0');
      const dd = String(hoje.getDate()).padStart(2, '0');
      this.dataInicial = `${yyyy}-${mm}-${dd}`;
    }
    if (this.dataFinal == '') {
      // Formata para YYYY-MM-DD
      const yyyy = hoje.getFullYear();
      const mm = String(hoje.getMonth() + 1).padStart(2, '0');
      const dd = String(hoje.getDate()).padStart(2, '0');
      this.dataFinal = `${yyyy}-${mm}-${dd}`;
    }

  }

  onListTransactions(page?: number) {
    this.loadingService.show();// Ativa o loading

    if (page)
      this.pageNumber = page;

    const token = localStorage.getItem('token');
    const merchantId = localStorage.getItem('merchantId');
    this.error = '';

    const payload = {
      merchant_id: merchantId,
      start_date: this.formatDateToDDMMYYYY(this.dataInicial), // enviar DD.MM.YYYY
      end_date: this.formatDateToDDMMYYYY(this.dataFinal), // enviar DD.MM.YYYY
      page_number: this.pageNumber.toString(),
      page_size: this.pageSize.toString()
    };

    // Criando os headers
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post<any>(`${AppConstants.UrlBase}/statement/merchant/transactions`, payload, { headers })
      .subscribe({
        next: (response) => {
          if (response && response.response_code == "00") {
            // Mapeia os dados recebidos para o DTO formatado
            this.transactions = (response.transactions || []).map((t: any) => ({
              date: t.date,
              cardLastDigits: t.card_last_digits,
              transactionType: t.transaction_type,
              transactionDescription: t.transaction_description,
              amount: parseInt(t.amount, 10) / 100,
              amountType: t.amount_type
            })) as TransactionDto[];

            // Verifica se há próxima página
            this.hasNextPage = (response.transactions || []).length === this.pageSize;

            this.loadingService.hide(); // Para desativar o loading
          } else {
            this.error = 'Erro ao consultar.';
            this.transactions = [];

            if (response && response.response_message != "") {
              this.error = response.response_message;
            }

            this.loadingService.hide(); // Para desativar o loading
          }
        },
        error: () => {
          this.error = 'Erro ao consultar.';
          this.transactions = [];

          this.loadingService.hide(); // Para desativar o loading
        }
      });

  }

  onPreviousPage() {
    if (this.pageNumber > 1) {
      this.onListTransactions(this.pageNumber - 1);
    }
  }

  onNextPage() {
    if (this.hasNextPage) {
      this.onListTransactions(this.pageNumber + 1);
    }
  }

}

export interface TransactionDto {
  date: string; // ou Date, se preferir converter para objeto Date
  cardLastDigits: string;
  transactionType: string;
  transactionDescription: string;
  amount: number;
  amountType: string;
}
