import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-create_sale',
  templateUrl: './create_sale.component.html',
  styles: ``
})

export class CreateSaleComponent {
  nomePagador: string = '';
  numeroCPF: string = '';
  numeroCartao: string = '';
  validade: string = '';
  cvv: string = '';
  valor: string = '';
  parcelas: string = '';
  error: string = '';
  authorization: string = '';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  onValorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove tudo que não for dígito
    let digits = input.value.replace(/\D/g, '');

    // Garante pelo menos 1 dígito
    if (digits.length === 0) {
      digits = '0';
    }

    // Converte para número e divide por 100 para obter centavos
    const numberValue = parseFloat(digits) / 100;

    // Formata para o padrão brasileiro com 2 casas decimais
    const formatted = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    input.value = formatted.replace(".", "").replace(",", ".");
  }

  onCreateSale() {
    this.loadingService.show();// Ativa o loading

    if (this.valor.toString().replace(".", "").replace(",", "") == '') {
      this.valor = '0';
    }
    if (this.parcelas == '') {
      this.parcelas = '0';
    }

    const token = localStorage.getItem('token');
    const merchantId = localStorage.getItem('merchantId');
    this.error = '';

    const payload = {
      reference_id: "",
      merchant_id: merchantId,
      capture: true,
      payer: {
        identification: { type: "CPF", number: this.numeroCPF }
      },
      payment: {
        amount: this.valor.toString().replace(".", "").replace(",", ""), //deve ser string no formato "100"
        installments: this.parcelas.toString(), //deve ser string no formato "100"
      },
      card: {
        number: this.numeroCartao,
        holderName: this.nomePagador,
        expirationDate: this.validade,
        securityCode: this.cvv
      },
      soft_descriptor: { name: "", detail: "" }
    };

    // Criando os headers
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post<any>(`${AppConstants.UrlBase}/ecommerce/venda`, payload, { headers })
      .subscribe({
        next: (response) => {
          if (response && response.response_code == "00") {

            this.loadingService.hide(); // Para desativar o loading
          } else {
            this.error = 'Venda não efetuada.';

            if (response && response.response_message != "") {
              this.error = response.response_message;

              this.loadingService.hide(); // Para desativar o loading
            }
          }
        },
        error: () => {
          this.error = 'Erro ao efetuar venda.';

          this.loadingService.hide(); // Para desativar o loading
        }
      });
  }
}
